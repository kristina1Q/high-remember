import { WordForms } from '../types/word';

// 常见不规则动词表 (100+ 核心词汇)
const IRREGULAR_VERBS: Record<string, { past: string; pastParticiple: string; presentParticiple?: string; thirdPerson?: string }> = {
  arise: { past: 'arose', pastParticiple: 'arisen' },
  awake: { past: 'awoke', pastParticiple: 'awoken' },
  be: { past: 'was/were', pastParticiple: 'been', presentParticiple: 'being', thirdPerson: 'is' },
  bear: { past: 'bore', pastParticiple: 'borne' },
  beat: { past: 'beat', pastParticiple: 'beaten' },
  become: { past: 'became', pastParticiple: 'become' },
  begin: { past: 'began', pastParticiple: 'begun' },
  bend: { past: 'bent', pastParticiple: 'bent' },
  bet: { past: 'bet', pastParticiple: 'bet' },
  bind: { past: 'bound', pastParticiple: 'bound' },
  bite: { past: 'bit', pastParticiple: 'bitten' },
  blow: { past: 'blew', pastParticiple: 'blown' },
  break: { past: 'broke', pastParticiple: 'broken' },
  breed: { past: 'bred', pastParticiple: 'bred' },
  bring: { past: 'brought', pastParticiple: 'brought' },
  broadcast: { past: 'broadcast', pastParticiple: 'broadcast' },
  build: { past: 'built', pastParticiple: 'built' },
  burn: { past: 'burnt/burned', pastParticiple: 'burnt/burned' },
  buy: { past: 'bought', pastParticiple: 'bought' },
  catch: { past: 'caught', pastParticiple: 'caught' },
  choose: { past: 'chose', pastParticiple: 'chosen' },
  come: { past: 'came', pastParticiple: 'come' },
  cost: { past: 'cost', pastParticiple: 'cost' },
  creep: { past: 'crept', pastParticiple: 'crept' },
  cut: { past: 'cut', pastParticiple: 'cut', presentParticiple: 'cutting' },
  deal: { past: 'dealt', pastParticiple: 'dealt' },
  dig: { past: 'dug', pastParticiple: 'dug', presentParticiple: 'digging' },
  do: { past: 'did', pastParticiple: 'done', presentParticiple: 'doing', thirdPerson: 'does' },
  draw: { past: 'drew', pastParticiple: 'drawn' },
  dream: { past: 'dreamt/dreamed', pastParticiple: 'dreamt/dreamed' },
  drink: { past: 'drank', pastParticiple: 'drunk' },
  drive: { past: 'drove', pastParticiple: 'driven' },
  eat: { past: 'ate', pastParticiple: 'eaten' },
  fall: { past: 'fell', pastParticiple: 'fallen' },
  feed: { past: 'fed', pastParticiple: 'fed' },
  feel: { past: 'felt', pastParticiple: 'felt' },
  fight: { past: 'fought', pastParticiple: 'fought' },
  find: { past: 'found', pastParticiple: 'found' },
  flee: { past: 'fled', pastParticiple: 'fled' },
  fly: { past: 'flew', pastParticiple: 'flown' },
  forbid: { past: 'forbade', pastParticiple: 'forbidden' },
  forget: { past: 'forgot', pastParticiple: 'forgotten' },
  forgive: { past: 'forgave', pastParticiple: 'forgiven' },
  freeze: { past: 'froze', pastParticiple: 'frozen' },
  get: { past: 'got', pastParticiple: 'got/gotten' },
  give: { past: 'gave', pastParticiple: 'given' },
  go: { past: 'went', pastParticiple: 'gone', presentParticiple: 'going', thirdPerson: 'goes' },
  grow: { past: 'grew', pastParticiple: 'grown' },
  hang: { past: 'hung', pastParticiple: 'hung' },
  have: { past: 'had', pastParticiple: 'had', presentParticiple: 'having', thirdPerson: 'has' },
  hear: { past: 'heard', pastParticiple: 'heard' },
  hide: { past: 'hid', pastParticiple: 'hidden' },
  hit: { past: 'hit', pastParticiple: 'hit', presentParticiple: 'hitting' },
  hold: { past: 'held', pastParticiple: 'held' },
  hurt: { past: 'hurt', pastParticiple: 'hurt' },
  keep: { past: 'kept', pastParticiple: 'kept' },
  know: { past: 'knew', pastParticiple: 'known' },
  lay: { past: 'laid', pastParticiple: 'laid' },
  lead: { past: 'led', pastParticiple: 'led' },
  learn: { past: 'learnt/learned', pastParticiple: 'learnt/learned' },
  leave: { past: 'left', pastParticiple: 'left' },
  lend: { past: 'lent', pastParticiple: 'lent' },
  let: { past: 'let', pastParticiple: 'let', presentParticiple: 'letting' },
  lie: { past: 'lay', pastParticiple: 'lain', presentParticiple: 'lying' },
  light: { past: 'lit/lighted', pastParticiple: 'lit/lighted' },
  lose: { past: 'lost', pastParticiple: 'lost' },
  make: { past: 'made', pastParticiple: 'made' },
  mean: { past: 'meant', pastParticiple: 'meant' },
  meet: { past: 'met', pastParticiple: 'met' },
  pay: { past: 'paid', pastParticiple: 'paid' },
  put: { past: 'put', pastParticiple: 'put', presentParticiple: 'putting' },
  quit: { past: 'quit', pastParticiple: 'quit' },
  read: { past: 'read', pastParticiple: 'read' },
  ride: { past: 'rode', pastParticiple: 'ridden' },
  ring: { past: 'rang', pastParticiple: 'rung' },
  rise: { past: 'rose', pastParticiple: 'risen' },
  run: { past: 'ran', pastParticiple: 'run', presentParticiple: 'running' },
  say: { past: 'said', pastParticiple: 'said' },
  see: { past: 'saw', pastParticiple: 'seen' },
  seek: { past: 'sought', pastParticiple: 'sought' },
  sell: { past: 'sold', pastParticiple: 'sold' },
  send: { past: 'sent', pastParticiple: 'sent' },
  set: { past: 'set', pastParticiple: 'set', presentParticiple: 'setting' },
  shake: { past: 'shook', pastParticiple: 'shaken' },
  shine: { past: 'shone', pastParticiple: 'shone' },
  shoot: { past: 'shot', pastParticiple: 'shot' },
  show: { past: 'showed', pastParticiple: 'shown' },
  shrink: { past: 'shrank', pastParticiple: 'shrunk' },
  shut: { past: 'shut', pastParticiple: 'shut', presentParticiple: 'shutting' },
  sing: { past: 'sang', pastParticiple: 'sung' },
  sink: { past: 'sank', pastParticiple: 'sunk' },
  sit: { past: 'sat', pastParticiple: 'sat', presentParticiple: 'sitting' },
  sleep: { past: 'slept', pastParticiple: 'slept' },
  slide: { past: 'slid', pastParticiple: 'slid' },
  speak: { past: 'spoke', pastParticiple: 'spoken' },
  spend: { past: 'spent', pastParticiple: 'spent' },
  split: { past: 'split', pastParticiple: 'split' },
  spread: { past: 'spread', pastParticiple: 'spread' },
  stand: { past: 'stood', pastParticiple: 'stood' },
  steal: { past: 'stole', pastParticiple: 'stolen' },
  stick: { past: 'stuck', pastParticiple: 'stuck' },
  strike: { past: 'struck', pastParticiple: 'struck' },
  sweep: { past: 'swept', pastParticiple: 'swept' },
  swim: { past: 'swam', pastParticiple: 'swum', presentParticiple: 'swimming' },
  swing: { past: 'swung', pastParticiple: 'swung' },
  take: { past: 'took', pastParticiple: 'taken' },
  teach: { past: 'taught', pastParticiple: 'taught' },
  tear: { past: 'tore', pastParticiple: 'torn' },
  tell: { past: 'told', pastParticiple: 'told' },
  think: { past: 'thought', pastParticiple: 'thought' },
  throw: { past: 'threw', pastParticiple: 'thrown' },
  understand: { past: 'understood', pastParticiple: 'understood' },
  wake: { past: 'woke', pastParticiple: 'woken' },
  wear: { past: 'wore', pastParticiple: 'worn' },
  win: { past: 'won', pastParticiple: 'won', presentParticiple: 'winning' },
  withdraw: { past: 'withdrew', pastParticiple: 'withdrawn' },
  write: { past: 'wrote', pastParticiple: 'written' }
};

// 常见特殊形容词副词映射
const IRREGULAR_ADVERBS: Record<string, string> = {
  good: 'well',
  fast: 'fast',
  hard: 'hard',
  early: 'early',
  late: 'late',
  public: 'publicly',
  whole: 'wholly',
  true: 'truly',
  due: 'duly',
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly',
  straight: 'straight'
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

/**
 * 判断是否以辅音+元音+辅音结尾（短音节辅音双写判定）
 */
function isCVC(word: string): boolean {
  if (word.length < 3) return false;
  const c3 = word[word.length - 1].toLowerCase();
  const v = word[word.length - 2].toLowerCase();
  const c1 = word[word.length - 3].toLowerCase();

  // 末尾不能是 w, x, y
  if (['w', 'x', 'y'].includes(c3)) return false;

  const isVowel = (char: string) => VOWELS.has(char);
  return !isVowel(c1) && isVowel(v) && !isVowel(c3);
}

/**
 * 动词时态规律变化推断
 */
export function deriveVerbTenses(rawWord: string): {
  past: string;
  pastParticiple: string;
  presentParticiple: string;
  thirdPerson: string;
} {
  const w = rawWord.toLowerCase().trim();

  // 1. 直接查不规则动词字典
  if (IRREGULAR_VERBS[w]) {
    const entry = IRREGULAR_VERBS[w];
    return {
      past: entry.past,
      pastParticiple: entry.pastParticiple,
      presentParticiple: entry.presentParticiple || deriveRegularPresentParticiple(w),
      thirdPerson: entry.thirdPerson || deriveRegularThirdPerson(w)
    };
  }

  // 2. 检查前缀复合不规则动词 (如 rebuild -> rebuilt, undertake -> undertook)
  for (const base of Object.keys(IRREGULAR_VERBS)) {
    if (w.length > base.length && w.endsWith(base)) {
      const prefix = w.slice(0, w.length - base.length);
      const entry = IRREGULAR_VERBS[base];
      return {
        past: prefix + entry.past,
        pastParticiple: prefix + entry.pastParticiple,
        presentParticiple: entry.presentParticiple ? prefix + entry.presentParticiple : deriveRegularPresentParticiple(w),
        thirdPerson: entry.thirdPerson ? prefix + entry.thirdPerson : deriveRegularThirdPerson(w)
      };
    }
  }

  // 3. 规则动词推导
  let past = '';
  if (w.endsWith('e')) {
    past = w + 'd';
  } else if (w.endsWith('y') && w.length > 1 && !VOWELS.has(w[w.length - 2])) {
    past = w.slice(0, -1) + 'ied';
  } else if (isCVC(w) && w.length <= 4) {
    past = w + w[w.length - 1] + 'ed';
  } else {
    past = w + 'ed';
  }

  return {
    past,
    pastParticiple: past,
    presentParticiple: deriveRegularPresentParticiple(w),
    thirdPerson: deriveRegularThirdPerson(w)
  };
}

/**
 * 规则现在分词 (-ing) 推导
 */
function deriveRegularPresentParticiple(w: string): string {
  if (w.endsWith('ie')) {
    return w.slice(0, -2) + 'ying';
  }
  if (w.endsWith('ee') || w.endsWith('oe') || w.endsWith('ye')) {
    return w + 'ing';
  }
  if (w.endsWith('e') && w.length > 2) {
    return w.slice(0, -1) + 'ing';
  }
  if (isCVC(w) && w.length <= 4) {
    return w + w[w.length - 1] + 'ing';
  }
  return w + 'ing';
}

/**
 * 规则第三人称单数 (-s / -es) 推导
 */
function deriveRegularThirdPerson(w: string): string {
  if (w.endsWith('s') || w.endsWith('sh') || w.endsWith('ch') || w.endsWith('x') || w.endsWith('z') || w.endsWith('o')) {
    return w + 'es';
  }
  if (w.endsWith('y') && w.length > 1 && !VOWELS.has(w[w.length - 2])) {
    return w.slice(0, -1) + 'ies';
  }
  return w + 's';
}

/**
 * 形容词副词形式推断 (Adjective -> Adverb Form)
 */
export function deriveAdverb(rawWord: string): string {
  const w = rawWord.toLowerCase().trim();

  // 1. 特殊副词表
  if (IRREGULAR_ADVERBS[w]) {
    return IRREGULAR_ADVERBS[w];
  }

  // 2. 以 -ic 结尾 -> -ically (如 aesthetic -> aesthetically, automatic -> automatically)
  if (w.endsWith('ic')) {
    return w + 'ally';
  }

  // 3. 以辅音 + -le 结尾 -> 变为 -ly (如 gentle -> gently, simple -> simply, terrible -> terribly, subtle -> subtly)
  if (w.endsWith('le') && w.length > 2 && !VOWELS.has(w[w.length - 3])) {
    return w.slice(0, -1) + 'y';
  }

  // 4. 以辅音 + -y 结尾 -> -ily (如 happy -> happily, easy -> easily, heavy -> heavily)
  if (w.endsWith('y') && w.length > 1 && !VOWELS.has(w[w.length - 2])) {
    return w.slice(0, -1) + 'ily';
  }

  // 5. 以 -ue 结尾 -> -uly (如 true -> truly, due -> duly)
  if (w.endsWith('ue')) {
    return w.slice(0, -1) + 'ly';
  }

  // 6. 以 -ll 结尾 -> + y (如 full -> fully)
  if (w.endsWith('ll')) {
    return w + 'y';
  }

  // 7. 常规直接加 -ly (如 resilient -> resiliently, eloquent -> eloquently, abundant -> abundantly)
  return w + 'ly';
}

/**
 * 智能判断词性是否包含动词
 */
export function isVerbPos(pos: string): boolean {
  if (!pos) return false;
  const p = pos.toLowerCase();
  return p.includes('v.') || p.includes('vt.') || p.includes('vi.') || p === 'v' || p.startsWith('verb');
}

/**
 * 智能判断词性是否包含形容词
 */
export function isAdjectivePos(pos: string): boolean {
  if (!pos) return false;
  const p = pos.toLowerCase();
  return p.includes('adj.') || p.includes('a.') || p === 'adj' || p.startsWith('adjective');
}

/**
 * 智能综合生成单词形态变化数据
 * @param word 单词原文
 * @param partOfSpeech 词性 (如 v. / adj. / n.)
 * @param apiWfs 可选有道在线 API 返回的 wfs 数组
 */
export function buildWordForms(word: string, partOfSpeech: string, apiWfs?: any[]): WordForms {
  const forms: WordForms = {};
  const cleanWord = word.trim().toLowerCase();
  const hasVerb = isVerbPos(partOfSpeech);
  const hasAdj = isAdjectivePos(partOfSpeech);

  // 1. 若 API 提供了 wfs 原始数据，优先提取官方标准释义
  if (Array.isArray(apiWfs) && apiWfs.length > 0) {
    for (const item of apiWfs) {
      const name = item?.wf?.name || '';
      const value = item?.wf?.value || '';
      if (!value) continue;

      if (name.includes('过去式') && !name.includes('过去分词')) {
        forms.past = value;
      } else if (name.includes('过去分词')) {
        forms.pastParticiple = value;
      } else if (name.includes('现在分词') || name.includes('动名词')) {
        forms.presentParticiple = value;
      } else if (name.includes('第三人称单数')) {
        forms.thirdPerson = value;
      } else if (name.includes('副词')) {
        forms.adverb = value;
      } else if (name.includes('比较级')) {
        forms.comparative = value;
      } else if (name.includes('最高级')) {
        forms.superlative = value;
      } else if (name.includes('复数')) {
        forms.plural = value;
      }
    }
  }

  // 2. 动词形态补全 (过去式、过去分词、现在分词、第三人称单数)
  if (hasVerb) {
    const tenses = deriveVerbTenses(cleanWord);
    if (!forms.past) forms.past = tenses.past;
    if (!forms.pastParticiple) forms.pastParticiple = tenses.pastParticiple;
    if (!forms.presentParticiple) forms.presentParticiple = tenses.presentParticiple;
    if (!forms.thirdPerson) forms.thirdPerson = tenses.thirdPerson;
  }

  // 3. 形容词副词形态补全
  if (hasAdj) {
    if (!forms.adverb) {
      forms.adverb = deriveAdverb(cleanWord);
    }
  }

  return forms;
}
