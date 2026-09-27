import { WordItem, WallpaperConfig } from '../types/word';
import { INITIAL_WORDS } from '../data/initialWords';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const STORAGE_KEYS = {
  WORDS: 'high_remember_words_v1',
  WALLPAPER: 'high_remember_wallpaper_v1'
};

const DEFAULT_WALLPAPER: WallpaperConfig = {
  type: 'preset',
  presetId: 'morandi-blue',
  customImageData: null,
  blur: 0,
  overlayOpacity: 0.15,
  isDarkMode: false
};

import { LOCAL_DICTIONARY } from '../data/localDict';
import { buildWordForms } from '../utils/wordForms';

export function loadWords(): WordItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORDS);
    if (!raw) {
      const initialized = INITIAL_WORDS.map(w => ({
        ...w,
        forms: w.forms || buildWordForms(w.word, w.partOfSpeech)
      }));
      saveWords(initialized);
      return initialized;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // 自动自愈与纠正：针对曾因旧版查询异常而残留的错误词性或缺失的形态变化，进行即时无损校准
      let needsResave = false;
      const healedWords = parsed.map((item: WordItem) => {
        let currentItem = item;
        const clean = item.word?.trim().toLowerCase();
        if (clean && LOCAL_DICTIONARY[clean]) {
          const dict = LOCAL_DICTIONARY[clean];
          const hasBrokenPos = (item.partOfSpeech === 'n.' && dict.partOfSpeech !== 'n.') || !item.partOfSpeech;
          const hasFallbackDef =
            !item.meaningEn ||
            item.meaningEn.includes('The authentic meaning or quality associated with') ||
            item.meaningEn.includes('To actively understand and apply') ||
            !item.meaningZh ||
            item.meaningZh.includes('的中文释义');

          if (hasBrokenPos || hasFallbackDef) {
            needsResave = true;
            currentItem = {
              ...item,
              partOfSpeech: dict.partOfSpeech,
              phonetic: dict.phonetic || item.phonetic,
              meaningZh: hasFallbackDef ? dict.meaningZh : item.meaningZh,
              meaningEn: hasFallbackDef ? dict.meaningEn : item.meaningEn,
              exampleEn: hasFallbackDef ? dict.exampleEn : item.exampleEn,
              exampleZh: hasFallbackDef ? dict.exampleZh : item.exampleZh,
            };
          }
        }

        // 动词时态与形容词副词自动增量补全
        if (!currentItem.forms || (!currentItem.forms.past && !currentItem.forms.adverb)) {
          needsResave = true;
          currentItem = {
            ...currentItem,
            forms: buildWordForms(currentItem.word, currentItem.partOfSpeech)
          };
        }

        return currentItem;
      });

      if (needsResave) {
        saveWords(healedWords);
      }
      return healedWords;
    }
    return INITIAL_WORDS;
  } catch (err) {
    console.error('Failed to load words from storage', err);
    return INITIAL_WORDS;
  }
}

export function saveWords(words: WordItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
  } catch (err) {
    console.error('Failed to save words to storage', err);
  }
}

export function loadWallpaperConfig(): WallpaperConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WALLPAPER);
    if (!raw) return DEFAULT_WALLPAPER;
    return { ...DEFAULT_WALLPAPER, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_WALLPAPER;
  }
}

export function saveWallpaperConfig(config: WallpaperConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WALLPAPER, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save wallpaper config', err);
  }
}

/**
 * 双引擎高兼容剪贴板复制器 (适配原生移动端 Android WebView 与桌面浏览器)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. 优先使用标准现代 Clipboard API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 降级到文本框选中复制
    }
  }

  // 2. 经典 DOM 模拟选中复制（Android 各大机型与内嵌环境 100% 成功率）
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('复制到剪贴板失败', err);
    return false;
  }
}

export interface LocalBackupInfo {
  name: string;
  directory: Directory;
  displayLocation: string;
  size?: number;
  mtime?: number;
}

export interface BackupResult {
  success: boolean;
  fileName: string;
  displayPath: string;
  isNative: boolean;
  savedInDocuments: boolean;
  message: string;
  uri?: string;
}

/**
 * 手机本地直接保存器（一键直接存储到手机本地 Documents / 下载目录，无任何多余弹窗与分享步骤）
 */
export async function saveBackupToLocal(
  words: WordItem[],
  wallpaper?: WallpaperConfig
): Promise<BackupResult> {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  const fileName = `忆词备份_${dateStr}_${timeStr}.json`;

  const exportPayload = {
    app: 'HighRemember',
    appName: '忆词 HighRemember',
    version: '1.2.0',
    exportTime: now.toISOString(),
    wordsCount: words.length,
    words,
    wallpaper
  };
  const jsonStr = JSON.stringify(exportPayload, null, 2);

  // 1. 原生 Android / 手机环境
  if (Capacitor.isNativePlatform()) {
    try {
      // 检查或请求存储权限
      try {
        const permStatus = await Filesystem.checkPermissions();
        if (permStatus.publicStorage !== 'granted') {
          await Filesystem.requestPermissions();
        }
      } catch (permErr) {
        console.warn('检查存储权限提示', permErr);
      }

      let finalUri = '';
      let displayPath = '';
      let savedInDocuments = false;

      // 优先保存至公有 Documents 目录（用户可在手机自带【文件管理】->【文档】直接看到）
      try {
        const writeRes = await Filesystem.writeFile({
          path: fileName,
          data: jsonStr,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });
        finalUri = writeRes.uri;
        savedInDocuments = true;
        displayPath = `手机存储 / Documents / ${fileName}`;
      } catch (docErr) {
        console.warn('写入 Documents 目录受限，转存至应用存储', docErr);
        const fallbackRes = await Filesystem.writeFile({
          path: fileName,
          data: jsonStr,
          directory: Directory.Data,
          encoding: Encoding.UTF8
        });
        finalUri = fallbackRes.uri;
        displayPath = `应用存储 / ${fileName}`;
      }

      // 仅在 Documents 写入失败时，才回退写入应用存储 Data
      // 不在 Documents 成功时额外写 Data 副本，避免外部删除后 Data 副本残留引发混淆

      return {
        success: true,
        fileName,
        displayPath,
        uri: finalUri,
        isNative: true,
        savedInDocuments,
        message: savedInDocuments
          ? `已成功保存到手机本地！\n📁 文件路径：${displayPath}\n可在手机【文件管理】->【文档】中查看。`
          : `已成功保存到应用存储！\n📁 文件路径：${displayPath}`
      };
    } catch (err: any) {
      console.error('手机本地保存失败', err);
      throw new Error(`保存到手机本地失败: ${err?.message || '未知错误，请检查手机存储权限'}`);
    }
  }

  // 2. 网页与浏览器环境（直接下载到电脑或手机的“下载”文件夹）
  try {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 1500);

    return {
      success: true,
      fileName,
      displayPath: `下载文件夹 / ${fileName}`,
      isNative: false,
      savedInDocuments: false,
      message: `已成功保存备份文件至下载目录：${fileName}`
    };
  } catch (err: any) {
    console.error('浏览器下载失败', err);
    throw new Error('下载文件失败，请尝试复制文本');
  }
}

/**
 * 彻底删除手机本地的指定备份文件（同时清理 Documents 与应用内部存储）
 */
export async function deleteLocalBackup(fileName: string, directory?: Directory): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  let deletedAny = false;

  const targetDirs = directory 
    ? [directory, Directory.Data, Directory.Documents, Directory.External]
    : [Directory.Data, Directory.Documents, Directory.External];

  for (const dir of targetDirs) {
    try {
      await Filesystem.deleteFile({
        path: fileName,
        directory: dir
      });
      deletedAny = true;
    } catch {
      // 忽略文件在某个特定目录不存在的报错
    }
  }

  return deletedAny;
}

/**
 * 一键清理所有本地“忆词”备份文件
 */
export async function clearAllLocalBackups(): Promise<number> {
  if (!Capacitor.isNativePlatform()) return 0;
  const list = await listLocalBackups();
  let count = 0;
  for (const item of list) {
    try {
      await deleteLocalBackup(item.name, item.directory);
      count++;
    } catch {
      // ignore
    }
  }
  return count;
}

/**
 * 自动扫描手机本地已存在的“忆词”备份文件（支持 Documents 和应用内部存储）
 */
export async function listLocalBackups(): Promise<LocalBackupInfo[]> {
  if (!Capacitor.isNativePlatform()) return [];
  const list: LocalBackupInfo[] = [];
  const seen = new Set<string>();

  // 1. 扫描 Documents 目录
  try {
    const res = await Filesystem.readdir({
      path: '',
      directory: Directory.Documents
    });
    for (const f of res.files) {
      const name = typeof f === 'string' ? f : f.name;
      if (name.endsWith('.json') && !seen.has(name)) {
        seen.add(name);
        list.push({
          name,
          directory: Directory.Documents,
          displayLocation: '手机存储 / Documents',
          size: typeof f === 'object' ? f.size : undefined,
          mtime: typeof f === 'object' ? f.mtime : undefined
        });
      }
    }
  } catch (e) {
    console.warn('扫描 Documents 目录异常', e);
  }

  // 2. 扫描 Data 目录
  try {
    const resData = await Filesystem.readdir({
      path: '',
      directory: Directory.Data
    });
    for (const f of resData.files) {
      const name = typeof f === 'string' ? f : f.name;
      if (name.endsWith('.json') && !seen.has(name)) {
        seen.add(name);
        list.push({
          name,
          directory: Directory.Data,
          displayLocation: '应用内部存储',
          size: typeof f === 'object' ? f.size : undefined,
          mtime: typeof f === 'object' ? f.mtime : undefined
        });
      }
    }
  } catch (e) {
    console.warn('扫描 Data 目录异常', e);
  }

  // 排序：最新的备份排在最前面
  list.sort((a, b) => b.name.localeCompare(a.name));
  return list;
}

/**
 * 直接读取手机本地保存的备份文件内容
 */
export async function readLocalBackup(fileName: string, directory: Directory = Directory.Documents): Promise<string> {
  try {
    const res = await Filesystem.readFile({
      path: fileName,
      directory,
      encoding: Encoding.UTF8
    });
    if (typeof res.data === 'string') {
      return res.data;
    }
    return await (res.data as Blob).text();
  } catch (err) {
    // 兜底尝试备用目录
    const altDir = directory === Directory.Documents ? Directory.Data : Directory.Documents;
    const resAlt = await Filesystem.readFile({
      path: fileName,
      directory: altDir,
      encoding: Encoding.UTF8
    });
    if (typeof resAlt.data === 'string') {
      return resAlt.data;
    }
    return await (resAlt.data as Blob).text();
  }
}

/**
 * 兼容导出方法（直接保存到本地）
 */
export async function exportDataSafely(
  words: WordItem[],
  wallpaper?: WallpaperConfig
): Promise<{ method: 'download' | 'share' | 'copy'; success: boolean; message: string; savedPath?: string }> {
  try {
    const res = await saveBackupToLocal(words, wallpaper);
    return {
      method: 'download',
      success: res.success,
      message: res.message,
      savedPath: res.displayPath
    };
  } catch (err: any) {
    return {
      method: 'download',
      success: false,
      message: err?.message || '保存失败'
    };
  }
}

/**
 * 智能解析外部导入的 JSON 备份数据
 */
export function parseImportedData(rawJson: string): { words: WordItem[]; wallpaper?: WallpaperConfig } {
  if (!rawJson || !rawJson.trim()) {
    throw new Error('导入内容为空，请选择文件或粘贴 JSON 数据');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(rawJson.trim());
  } catch {
    throw new Error('JSON 数据格式有误，请确保是合法的 JSON 文本');
  }

  let wordList: any[] = [];
  let wallpaperConfig: WallpaperConfig | undefined = undefined;

  if (Array.isArray(parsed)) {
    wordList = parsed;
  } else if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.words)) {
      wordList = parsed.words;
      if (parsed.wallpaper && typeof parsed.wallpaper === 'object') {
        wallpaperConfig = parsed.wallpaper;
      }
    } else {
      throw new Error('未在数据中找到包含单词列表的 words 数组');
    }
  } else {
    throw new Error('无效的数据格式，需为 JSON 数组或对象');
  }

  const validWords: WordItem[] = [];
  const now = Date.now();

  for (let i = 0; i < wordList.length; i++) {
    const item = wordList[i];
    if (!item || typeof item !== 'object') continue;
    const cleanWord = (item.word || '').trim();
    if (!cleanWord) continue;

    const pos = item.partOfSpeech || 'v. / n.';
    validWords.push({
      id: item.id || `word-imported-${now}-${i}`,
      word: cleanWord,
      phonetic: item.phonetic || `/${cleanWord}/`,
      partOfSpeech: pos,
      meaningZh: item.meaningZh || `${cleanWord} 的释义`,
      meaningEn: item.meaningEn || `The authentic definition and usage of "${cleanWord}".`,
      exampleEn: item.exampleEn || `We should actively practice using "${cleanWord}".`,
      exampleZh: item.exampleZh || `我们应该积极练习使用 "${cleanWord}"。`,
      forms: item.forms || buildWordForms(cleanWord, pos),
      createdAt: typeof item.createdAt === 'number' ? item.createdAt : now,
      reviewStage: typeof item.reviewStage === 'number' ? item.reviewStage : 0,
      scheduledDay: [2, 4, 7, 15].includes(item.scheduledDay) ? item.scheduledDay : 2,
      isMastered: Boolean(item.isMastered),
      isUnremembered: Boolean(item.isUnremembered),
      unrememberedCount: typeof item.unrememberedCount === 'number' ? item.unrememberedCount : 0,
      lastTrainedAt: item.lastTrainedAt,
      trainingHistory: Array.isArray(item.trainingHistory) ? item.trainingHistory : []
    });
  }

  if (validWords.length === 0) {
    throw new Error('解析完成，但数据中未检测到有效英文单词');
  }

  return { words: validWords, wallpaper: wallpaperConfig };
}

/**
 * 智能合并导入单词（智能去重，保留已有学习进度，更新释义与补充新词）
 */
export function mergeImportedWords(
  currentWords: WordItem[],
  importedWords: WordItem[]
): { merged: WordItem[]; addedCount: number; updatedCount: number } {
  const currentMap = new Map<string, WordItem>();
  currentWords.forEach(w => currentMap.set(w.word.toLowerCase().trim(), w));

  let addedCount = 0;
  let updatedCount = 0;

  const resultList: WordItem[] = [...currentWords];

  importedWords.forEach(imported => {
    const key = imported.word.toLowerCase().trim();
    if (currentMap.has(key)) {
      // 已存在：增量更新释义与例句，同时保留已有的复习天数、阶段与训练历史
      const existing = currentMap.get(key)!;
      const index = resultList.findIndex(w => w.id === existing.id);
      if (index !== -1) {
        resultList[index] = {
          ...existing,
          partOfSpeech: imported.partOfSpeech || existing.partOfSpeech,
          meaningZh: imported.meaningZh || existing.meaningZh,
          meaningEn: imported.meaningEn || existing.meaningEn,
          exampleEn: imported.exampleEn || existing.exampleEn,
          exampleZh: imported.exampleZh || existing.exampleZh,
          phonetic: imported.phonetic || existing.phonetic,
          forms: imported.forms || existing.forms || buildWordForms(existing.word, existing.partOfSpeech),
        };
        updatedCount++;
      }
    } else {
      // 新单词：直接并入词库
      resultList.push({
        ...imported,
        forms: imported.forms || buildWordForms(imported.word, imported.partOfSpeech)
      });
      currentMap.set(key, imported);
      addedCount++;
    }
  });

  return { merged: resultList, addedCount, updatedCount };
}

// 兼容旧版调用
export function exportWordsToJson(words: WordItem[]): void {
  exportDataSafely(words);
}
