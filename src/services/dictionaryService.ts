import { LOCAL_DICTIONARY } from '../data/localDict';
import { smartMatchWord } from '../utils/searchMatcher';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { WordForms } from '../types/word';
import { buildWordForms } from '../utils/wordForms';

export interface LookupResult {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningZh: string;
  meaningEn: string;
  exampleEn: string;
  exampleZh: string;
  audioUrl?: string;
  forms?: WordForms;
  source: 'local' | 'youdao' | 'api' | 'fallback';
}

export interface WordSuggestion {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningZh: string;
  score: number;
  highlightIndices: number[];
}

/**
 * 规范化单个词性标记 (将各类非规范形式转为标准的简写)
 */
export function normalizeSinglePos(rawPos: string): string {
  if (!rawPos) return '';
  const clean = rawPos.toLowerCase().trim().replace(/\s+/g, '');
  
  // 动词 (含及物、不及物、动名词等)
  if (
    clean === 'v.' ||
    clean === 'vt.' ||
    clean === 'vi.' ||
    clean === 'vt.&vi.' ||
    clean === 'v' ||
    clean === 'vt' ||
    clean === 'vi' ||
    clean.startsWith('verb')
  ) {
    return 'v.';
  }
  // 名词 (含可数、不可数、复数等)
  if (
    clean === 'n.' ||
    clean === 'cn.' ||
    clean === 'un.' ||
    clean === 'pl.' ||
    clean === 'n' ||
    clean === 'cn' ||
    clean === 'un' ||
    clean.startsWith('noun') ||
    clean.startsWith('n.(')
  ) {
    return 'n.';
  }
  // 形容词
  if (
    clean === 'adj.' ||
    clean === 'a.' ||
    clean === 'adj' ||
    clean.startsWith('adjective')
  ) {
    return 'adj.';
  }
  // 副词
  if (
    clean === 'adv.' ||
    clean === 'ad.' ||
    clean === 'adv' ||
    clean.startsWith('adverb')
  ) {
    return 'adv.';
  }
  // 介词
  if (
    clean === 'prep.' ||
    clean === 'prep' ||
    clean.startsWith('preposition')
  ) {
    return 'prep.';
  }
  // 代词
  if (
    clean === 'pron.' ||
    clean === 'pron' ||
    clean.startsWith('pronoun')
  ) {
    return 'pron.';
  }
  // 连词
  if (
    clean === 'conj.' ||
    clean === 'conj' ||
    clean.startsWith('conjunction')
  ) {
    return 'conj.';
  }
  // 感叹词
  if (
    clean === 'int.' ||
    clean === 'interj.' ||
    clean === 'int' ||
    clean.startsWith('interjection')
  ) {
    return 'interj.';
  }
  // 冠词
  if (
    clean === 'art.' ||
    clean === 'art' ||
    clean.startsWith('article')
  ) {
    return 'art.';
  }
  // 数词
  if (
    clean === 'num.' ||
    clean === 'num' ||
    clean.startsWith('numeral')
  ) {
    return 'num.';
  }

  return clean.endsWith('.') ? clean : `${clean}.`;
}

/**
 * 格式化多词性字符串 (例如 "v. / n.", "adj. / adv.")
 */
export function formatPartOfSpeech(pos: string): string {
  if (!pos) return 'v. / n.';
  // 分解可能包含的 / 、& 、空格
  const parts = pos.split(/[/,&+]/).map(p => p.trim()).filter(Boolean);
  const normalized = Array.from(new Set(parts.map(normalizeSinglePos).filter(Boolean)));
  if (normalized.length > 0) {
    return normalized.slice(0, 3).join(' / ');
  }
  return pos.endsWith('.') ? pos : `${pos}.`;
}

/**
 * 智能根据英语单词词根词缀推断词性（离线或兜底时使用）
 */
function inferPartOfSpeechByAffix(word: string): string {
  const w = word.toLowerCase().trim();
  // 动词后缀
  if (w.endsWith('ing') || w.endsWith('ize') || w.endsWith('ise') || w.endsWith('ate') || w.endsWith('ify')) {
    return 'v.';
  }
  // 名词后缀
  if (
    w.endsWith('tion') || w.endsWith('sion') || w.endsWith('ment') || w.endsWith('ness') ||
    w.endsWith('ity') || w.endsWith('ence') || w.endsWith('ance') || w.endsWith('ism') ||
    w.endsWith('ist') || w.endsWith('er') || w.endsWith('or') || w.endsWith('hood')
  ) {
    return 'n.';
  }
  // 形容词后缀
  if (
    w.endsWith('able') || w.endsWith('ible') || w.endsWith('ful') || w.endsWith('less') ||
    w.endsWith('ous') || w.endsWith('ive') || w.endsWith('ic') || w.endsWith('al')
  ) {
    return 'adj.';
  }
  // 副词后缀
  if (w.endsWith('ly')) {
    return 'adv.';
  }
  // 常见双用词默认为 v. / n.
  return 'v. / n.';
}

/**
 * 跨端安全网络请求器 (Android APK 原生 HTTP 绕过 CORS + Web 代理)
 */
async function fetchDictApiSafely(word: string): Promise<any> {
  const targetUrl = `https://dict.youdao.com/jsonapi?q=${encodeURIComponent(word)}`;

  // 1. 若运行在原生 Android / iOS APK 环境，使用 CapacitorHttp 原生请求（100% 绕过浏览器的跨域拦截）
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await CapacitorHttp.get({
        url: targetUrl,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        connectTimeout: 6000,
        readTimeout: 6000,
      });
      if (res.status === 200 && res.data) {
        return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      }
    } catch (e) {
      console.warn('CapacitorHttp 原生请求失败，尝试常规通道', e);
    }
  }

  // 2. Web 开发与预览环境：优先走 Vite 本地安全反向代理 (/youdao-api)
  const proxyUrl = `/youdao-api/jsonapi?q=${encodeURIComponent(word)}`;
  try {
    const controller = new AbortController();
    const tId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(tId);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // 代理不可用时尝试直连
  }

  // 3. 直连通道兜底
  try {
    const controller = new AbortController();
    const tId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(tId);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // 忽略直连错误
  }

  return null;
}

/**
 * 实时获取单词联想建议 (支持模糊容错，如 as -> aesthetic)
 */
export function getWordSuggestions(rawQuery: string, maxResults = 8): WordSuggestion[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const results: WordSuggestion[] = [];

  for (const key of Object.keys(LOCAL_DICTIONARY)) {
    const entry = LOCAL_DICTIONARY[key];
    const match = smartMatchWord(entry.word, entry.meaningZh, query);
    if (match.matched) {
      results.push({
        word: entry.word,
        phonetic: entry.phonetic,
        partOfSpeech: entry.partOfSpeech,
        meaningZh: entry.meaningZh,
        score: match.score,
        highlightIndices: match.highlightIndices
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.word.localeCompare(b.word))
    .slice(0, maxResults);
}

/**
 * 权威全自动双语解析接口 (自动获取中文释义、多词性聚合、英文原文定义、纯正应用造句)
 */
export async function lookupWord(rawWord: string): Promise<LookupResult> {
  const cleanWord = rawWord.trim().toLowerCase();
  if (!cleanWord) {
    throw new Error('请输入要查询的单词');
  }

  // 1. 本地精选离线词库优先秒查 (零延迟、释义与词性最规范)
  if (LOCAL_DICTIONARY[cleanWord]) {
    const entry = LOCAL_DICTIONARY[cleanWord];
    const pos = formatPartOfSpeech(entry.partOfSpeech);
    return {
      ...entry,
      partOfSpeech: pos,
      forms: buildWordForms(cleanWord, pos),
      source: 'local'
    };
  }

  // 1.1 变体容错 (如 esthetic -> aesthetic)
  if (cleanWord === 'esthetic' && LOCAL_DICTIONARY['aesthetic']) {
    const entry = LOCAL_DICTIONARY['aesthetic'];
    const pos = formatPartOfSpeech(entry.partOfSpeech);
    return {
      ...entry,
      partOfSpeech: pos,
      forms: buildWordForms('aesthetic', pos),
      source: 'local'
    };
  }

  // 2. 在线权威词典实时数据解析（含跨端原生 HTTP 与代理支持）
  try {
    const data = await fetchDictApiSafely(cleanWord);
    if (data) {
      // 提取音标 (优先美式美标)
      const usPhone =
        data?.ec?.word?.[0]?.usphone ||
        data?.simple?.word?.[0]?.['usphone'] ||
        data?.simple?.word?.[0]?.['ukphone'] ||
        '';
      const phonetic = usPhone ? `/${usPhone}/` : `/${cleanWord}/`;

      // 提取所有词性与对应中文释义
      const posSet = new Set<string>();
      const posList: string[] = [];
      const definitions: { pos: string; def: string }[] = [];

      const trsList = data?.ec?.word?.[0]?.trs;
      if (Array.isArray(trsList) && trsList.length > 0) {
        for (const item of trsList) {
          const text = item?.tr?.[0]?.l?.i?.[0] || '';
          if (!text || text.startsWith('【名】') || text.startsWith('【人名】')) {
            continue; // 过滤人名条目
          }

          const match = text.match(/^([a-zA-Z]+(?:\s*[&/]\s*[a-zA-Z]+)?\.)\s*(.*)$/);
          if (match) {
            const rawPos = match[1];
            const def = match[2].trim();
            const normPos = normalizeSinglePos(rawPos);
            if (normPos && !posSet.has(normPos)) {
              posSet.add(normPos);
              posList.push(normPos);
            }
            if (def) {
              // 选取核心释义项（最多取前3组分号项）
              const coreDefs = def
                .split(/[；;]/)
                .slice(0, 3)
                .map((s: string) => s.trim())
                .filter(Boolean)
                .join('；');
              definitions.push({ pos: normPos || rawPos, def: coreDefs || def });
            }
          } else if (!text.startsWith('【')) {
            definitions.push({ pos: '', def: text.trim() });
          }
        }
      }

      // 若未从 ec.trs 获取到有效释义，备选 expand_ec.transList
      if (definitions.length === 0) {
        const transList = data?.expand_ec?.word?.[0]?.transList;
        if (Array.isArray(transList) && transList.length > 0) {
          for (const item of transList) {
            const rawPos = item?.content?.detailPos || item?.pos || '';
            const def = item?.trans?.trim() || '';
            const normPos = normalizeSinglePos(rawPos);
            if (normPos && !posSet.has(normPos)) {
              posSet.add(normPos);
              posList.push(normPos);
            }
            if (def) {
              definitions.push({ pos: normPos || rawPos, def });
            }
          }
        }
      }

      // 综合生成精准词性
      let partOfSpeech = '';
      if (posList.length > 0) {
        partOfSpeech = posList.slice(0, 3).join(' / ');
      } else {
        partOfSpeech = inferPartOfSpeechByAffix(cleanWord);
      }

      // 格式化中文释义
      let meaningZh = '';
      if (definitions.length === 1) {
        meaningZh = definitions[0].def;
      } else if (definitions.length > 1) {
        if (posList.length > 1) {
          // 多词性清晰展示：例如 "v. 建造，修建 / n. 体形，体格"
          meaningZh = definitions
            .slice(0, 3)
            .map(d => (d.pos ? `${d.pos} ${d.def}` : d.def))
            .join(' / ');
        } else {
          meaningZh = definitions
            .slice(0, 3)
            .map(d => d.def)
            .join('；');
        }
      }

      // 提取原本英文释义 (English-English Original Definition)
      let meaningEn = '';
      const eeTrs = data?.ee?.word?.trs;
      if (Array.isArray(eeTrs) && eeTrs.length > 0) {
        const eeDefs: string[] = [];
        for (const item of eeTrs) {
          const raw = item?.tr?.[0]?.l?.i;
          if (typeof raw === 'string' && raw.trim()) {
            eeDefs.push(raw.trim());
          } else if (Array.isArray(raw)) {
            eeDefs.push(raw.join('; '));
          }
        }
        if (eeDefs.length > 0) {
          // 选取前2条最地道的英文原意，首字母大写
          const combined = eeDefs.slice(0, 2).join('; ');
          meaningEn = combined.charAt(0).toUpperCase() + combined.slice(1);
          if (!meaningEn.endsWith('.')) meaningEn += '.';
        }
      }

      // 提取权威例句 (Bilingual Example Sentence)
      let exampleEn = '';
      let exampleZh = '';
      const sents = data?.blng_sents_part?.['sentence-pair'];
      if (Array.isArray(sents) && sents.length > 0) {
        for (const sentItem of sents) {
          const sEn = (sentItem?.sentence || '').replace(/<[^>]+>/g, '').trim();
          const sZh = (sentItem?.['sentence-translation'] || '').replace(/<[^>]+>/g, '').trim();
          if (sEn && sZh && sEn.length <= 150) {
            exampleEn = sEn;
            exampleZh = sZh;
            break;
          }
        }
      }

      // 备选例句
      if (!exampleEn) {
        const oxfordSents = data?.expand_ec?.word?.[0]?.transList?.[0]?.content?.sents;
        if (Array.isArray(oxfordSents) && oxfordSents.length > 0) {
          exampleEn = oxfordSents[0]?.sentOrig?.replace(/<[^>]+>/g, '')?.trim() || '';
          exampleZh = oxfordSents[0]?.sentTrans?.trim() || '';
        }
      }

      // 兜底补全英文释义与例句
      if (!meaningEn) {
        meaningEn = `To actively understand and apply "${cleanWord}" in modern English contexts.`;
      }
      if (!exampleEn) {
        exampleEn = `Learning and using the word "${cleanWord}" will enrich your English vocabulary.`;
        exampleZh = `学习并掌握单词 "${cleanWord}" 将丰富你的英语词汇量。`;
      }

      if (meaningZh) {
        const formattedPos = formatPartOfSpeech(partOfSpeech);
        const wfsList = data?.ec?.word?.[0]?.wfs || data?.simple?.word?.[0]?.wfs;
        const forms = buildWordForms(cleanWord, formattedPos, wfsList);

        return {
          word: cleanWord,
          phonetic,
          partOfSpeech: formattedPos,
          meaningZh,
          meaningEn,
          exampleEn,
          exampleZh,
          forms,
          audioUrl: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanWord)}&type=2`,
          source: 'youdao'
        };
      }
    }
  } catch (err) {
    console.warn('在线词典查询异常', err);
  }

  // 3. 全球开放 API 兜底 (Free Dictionary API)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const apiRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const phonetic = item.phonetic || item.phonetics?.find((p: any) => p.text)?.text || `/${cleanWord}/`;
        
        // 聚合所有词性
        const meanings = item.meanings || [];
        const posList = Array.from(new Set(meanings.map((m: any) => normalizeSinglePos(m.partOfSpeech)).filter(Boolean))) as string[];
        const combinedPos = posList.length > 0 ? posList.slice(0, 3).join(' / ') : inferPartOfSpeechByAffix(cleanWord);
        const formattedPos = formatPartOfSpeech(combinedPos);

        const firstMeaning = meanings[0];
        const firstDef = firstMeaning?.definitions?.[0];
        const originalEnMeaning = firstDef?.definition || `Definition of ${cleanWord}`;
        const exampleEn = firstDef?.example || `Mastering "${cleanWord}" is helpful for daily conversation.`;

        return {
          word: cleanWord,
          phonetic,
          partOfSpeech: formattedPos,
          meaningZh: `${cleanWord}（${formattedPos}）`,
          meaningEn: originalEnMeaning,
          exampleEn,
          exampleZh: `掌握 "${cleanWord}" 对日常英语交流很有帮助。`,
          forms: buildWordForms(cleanWord, formattedPos),
          source: 'api'
        };
      }
    }
  } catch {
    // 忽略
  }

  // 4. 离线智能兜底
  const fallbackPos = formatPartOfSpeech(inferPartOfSpeechByAffix(cleanWord));
  return {
    word: cleanWord,
    phonetic: `/${cleanWord}/`,
    partOfSpeech: fallbackPos,
    meaningZh: `${cleanWord}（${fallbackPos}）`,
    meaningEn: `The authentic concept, meaning and functional usage of ${cleanWord}.`,
    exampleEn: `We should practice using "${cleanWord}" in writing and speaking.`,
    exampleZh: `我们应该在写作和口语中练习使用 "${cleanWord}"。`,
    forms: buildWordForms(cleanWord, fallbackPos),
    source: 'fallback'
  };
}
