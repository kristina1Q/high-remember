import { WordItem } from '../types/word';

const DAY_MS = 24 * 60 * 60 * 1000;
const now = Date.now();

export const INITIAL_WORDS: WordItem[] = [
  {
    id: "word-resilient",
    word: "resilient",
    phonetic: "/rɪˈzɪliənt/",
    partOfSpeech: "adj.",
    meaningZh: "有韧性的；能迅速恢复的；适应力强的",
    meaningEn: "Able to withstand or recover quickly from difficult conditions.",
    exampleEn: "Children are often remarkably resilient in the face of adversity.",
    exampleZh: "面对逆境时，孩子们往往展现出惊人的韧性与复原力。",
    createdAt: now - 2 * DAY_MS,
    reviewStage: 0,
    scheduledDay: 2,
    isMastered: false,
    isUnremembered: false,
    unrememberedCount: 0,
    trainingHistory: []
  },
  {
    id: "word-epiphany",
    word: "epiphany",
    phonetic: "/ɪˈpɪfəni/",
    partOfSpeech: "n.",
    meaningZh: "顿悟；神启；骤然领悟",
    meaningEn: "A moment of sudden and great revelation or insight.",
    exampleEn: "While taking a quiet walk in the woods, he had a sudden epiphany.",
    exampleZh: "在林间安静漫步时，他心中突然产生了一种顿悟。",
    createdAt: now - 4 * DAY_MS,
    reviewStage: 1,
    scheduledDay: 4,
    isMastered: false,
    isUnremembered: false,
    unrememberedCount: 0,
    trainingHistory: [
      { date: now - 2 * DAY_MS, interval: 2, result: 'remembered' }
    ]
  },
  {
    id: "word-meticulous",
    word: "meticulous",
    phonetic: "/məˈtɪkjələs/",
    partOfSpeech: "adj.",
    meaningZh: "一丝不苟的；缜密的；极其细致的",
    meaningEn: "Showing great attention to detail; very careful and precise.",
    exampleEn: "He conducted meticulous research before writing the report.",
    exampleZh: "在撰写报告之前，他进行了极其严密细致的调研。",
    createdAt: now - 7 * DAY_MS,
    reviewStage: 2,
    scheduledDay: 7,
    isMastered: false,
    isUnremembered: false,
    unrememberedCount: 0,
    trainingHistory: [
      { date: now - 5 * DAY_MS, interval: 2, result: 'remembered' },
      { date: now - 3 * DAY_MS, interval: 4, result: 'remembered' }
    ]
  },
  {
    id: "word-serendipity",
    word: "serendipity",
    phonetic: "/ˌserənˈdɪpəti/",
    partOfSpeech: "n.",
    meaningZh: "意外之喜；机缘巧合；不期而遇的幸运",
    meaningEn: "The occurrence of events by chance in a happy or beneficial way.",
    exampleEn: "Finding this rare book in an old antique shop was pure serendipity.",
    exampleZh: "在这家古董书店偶遇这本罕见的珍本纯属不期而遇的惊喜。",
    createdAt: now - 15 * DAY_MS,
    reviewStage: 3,
    scheduledDay: 15,
    isMastered: false,
    isUnremembered: false,
    unrememberedCount: 0,
    trainingHistory: [
      { date: now - 13 * DAY_MS, interval: 2, result: 'remembered' },
      { date: now - 11 * DAY_MS, interval: 4, result: 'remembered' },
      { date: now - 8 * DAY_MS, interval: 7, result: 'remembered' }
    ]
  },
  {
    id: "word-eloquent",
    word: "eloquent",
    phonetic: "/ˈeləkwənt/",
    partOfSpeech: "adj.",
    meaningZh: "雄辩的；有说服力的；口才好的",
    meaningEn: "Fluent or persuasive in speaking or writing.",
    exampleEn: "Her eloquent speech moved the entire audience to tears.",
    exampleZh: "她那充满说服力的雄辩演讲让全场听众为之动容落泪。",
    createdAt: now - 1 * DAY_MS,
    reviewStage: 0,
    scheduledDay: 2,
    isMastered: false,
    isUnremembered: true, // 初始置于未记住，方便用户一打开就能体验未记住板块
    unrememberedCount: 1,
    trainingHistory: [
      { date: now - 1 * DAY_MS, interval: 2, result: 'unremembered' }
    ]
  },
  {
    id: "word-aesthetic",
    word: "aesthetic",
    phonetic: "/iːsˈθetɪk/",
    partOfSpeech: "adj.",
    meaningZh: "美学的；审美的；悦目的",
    meaningEn: "Concerned with beauty or the appreciation of beauty.",
    exampleEn: "The clean architecture possesses great aesthetic appeal.",
    exampleZh: "这座简洁的建筑散发着极强的美学感染力。",
    createdAt: now - 3 * DAY_MS,
    reviewStage: 0,
    scheduledDay: 2,
    isMastered: false,
    isUnremembered: false,
    unrememberedCount: 0,
    trainingHistory: []
  },
  {
    id: "word-tranquil",
    word: "tranquil",
    phonetic: "/ˈtræŋkwɪl/",
    partOfSpeech: "adj.",
    meaningZh: "宁静的；安详的；平静的",
    meaningEn: "Free from disturbance; calm and peaceful.",
    exampleEn: "The mountain lake was still and tranquil in the morning mist.",
    exampleZh: "清晨薄雾中的高山湖泊静谧而安详。",
    createdAt: now - 8 * DAY_MS,
    reviewStage: 1,
    scheduledDay: 4,
    isMastered: false,
    isUnremembered: false,
    unrememberedCount: 0,
    trainingHistory: [
      { date: now - 6 * DAY_MS, interval: 2, result: 'remembered' }
    ]
  }
];
