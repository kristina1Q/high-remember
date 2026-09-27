export type ReviewInterval = 2 | 4 | 7 | 15;

export interface TrainingRecord {
  date: number;
  interval: ReviewInterval;
  result: 'remembered' | 'mastered' | 'unremembered';
}

export interface WordForms {
  // 动词形态变化 (Verb Forms)
  past?: string;              // 过去式 (如 built, abandoned)
  pastParticiple?: string;    // 过去分词 (如 built, abandoned)
  presentParticiple?: string; // 现在分词 / 动名词 (如 building, abandoning)
  thirdPerson?: string;       // 第三人称单数 (如 builds, abandons)
  
  // 形容词形态变化 (Adjective Forms)
  adverb?: string;            // 副词形式 (如 aesthetically, resiliently, eloquently)
  comparative?: string;       // 比较级 (如 faster, more abundant)
  superlative?: string;       // 最高级 (如 fastest, most abundant)
  
  // 名词形态变化 (Noun Forms)
  plural?: string;            // 复数形式 (如 abilities, epiphanies)
}

export interface WordItem {
  id: string;
  word: string;               // 英文单词原文
  phonetic?: string;          // 音标 (如 /rɪˈzɪliənt/)
  partOfSpeech: string;       // 词性 (如 adj. / n. / v.)
  meaningZh: string;          // 中文翻译
  meaningEn: string;          // 英文原本释义
  exampleEn: string;          // 英文简短例句
  exampleZh: string;          // 中文例句翻译
  forms?: WordForms;          // 词形与时态变化 (动词过去式/分词、形容词副词形式等)
  createdAt: number;          // 创建时间戳 (ms)
  
  // 训练调度字段
  reviewStage: number;        // 0:待第2天, 1:待第4天, 2:待第7天, 3:待第15天, 4:已完成所有轮次
  scheduledDay: ReviewInterval; // 当前待复习天数：2, 4, 7, 15
  isMastered: boolean;        // 熟记标记：熟记则不再出现在后续训练中
  isUnremembered: boolean;    // 未记住标记：放入“未记住的单词”板块
  unrememberedCount: number;  // 累计未记住次数
  lastTrainedAt?: number;     // 上次训练时间戳
  trainingHistory: TrainingRecord[];
  
  tags?: string[];
  notes?: string;
}

export interface WallpaperPreset {
  id: string;
  name: string;
  type: 'color' | 'gradient' | 'image';
  value: string;
  darkOverlay?: boolean;
}

export interface WallpaperConfig {
  type: 'preset' | 'custom';
  presetId: string;
  customImageData: string | null;
  originalImageData?: string | null;
  blur: number;            // 0 - 20 px
  overlayOpacity: number;  // 0.1 - 0.85
  isDarkMode: boolean;
}

export type ActiveTab = 'vault' | 'unremembered' | 'training';
