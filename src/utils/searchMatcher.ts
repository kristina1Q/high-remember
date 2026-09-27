/**
 * 智能字母搜索与模糊匹配工具
 * 支持：
 * 1. 严格前缀匹配 (如 "aes" -> "aesthetic")
 * 2. 连续子串包含 (如 "thetic" -> "aesthetic")
 * 3. 拼写容错与子序列模糊匹配 (如 "as" -> "aesthetic", "a-e-s-t-h-e-t-i-c")
 * 4. 常见双元音变体容错 (如 "as" -> "aes...", "es" -> "aes...")
 * 5. 中文释义包含匹配
 */

export interface MatchScore {
  matched: boolean;
  score: number;
  highlightIndices: number[]; // 匹配上的字符下标，用于高亮
}

export function smartMatchWord(word: string, meaningZh: string, rawQuery: string): MatchScore {
  const query = rawQuery.trim().toLowerCase();
  const target = word.toLowerCase();

  if (!query) {
    return { matched: true, score: 0, highlightIndices: [] };
  }

  // 1. 完全相同
  if (target === query) {
    return {
      matched: true,
      score: 1000,
      highlightIndices: Array.from({ length: target.length }, (_, i) => i)
    };
  }

  // 2. 前缀精确匹配
  if (target.startsWith(query)) {
    return {
      matched: true,
      score: 500 - (target.length - query.length),
      highlightIndices: Array.from({ length: query.length }, (_, i) => i)
    };
  }

  // 3. 常见发音/双元音拼写容错 (针对 as -> aesthetic, es -> aesthetic 等)
  // 如果输入以 as 开头，而单词以 aes 开头，算作高分变体匹配
  if (query.startsWith('as') && target.startsWith('aes')) {
    // 匹配 target 的 0 ('a') 和 2 ('s')
    const highlight = [0, 2];
    // 检查后面的字符是否继续匹配
    let targetIdx = 3;
    let queryIdx = 2;
    let ok = true;
    while (queryIdx < query.length) {
      const qChar = query[queryIdx];
      if (targetIdx < target.length && target[targetIdx] === qChar) {
        highlight.push(targetIdx);
        targetIdx++;
        queryIdx++;
      } else {
        ok = false;
        break;
      }
    }
    if (ok) {
      return {
        matched: true,
        score: 450 - (target.length - query.length),
        highlightIndices: highlight
      };
    }
  }

  // 4. 连续子串匹配
  const subIndex = target.indexOf(query);
  if (subIndex !== -1) {
    const highlight = Array.from({ length: query.length }, (_, i) => subIndex + i);
    return {
      matched: true,
      score: 300 - subIndex,
      highlightIndices: highlight
    };
  }

  // 5. 顺序子序列模糊匹配 (Fuzzy Subsequence Match)
  // 例如 query="as" 匹配 target="aesthetic" (第0个'a'与第2个's')
  let tIdx = 0;
  let qIdx = 0;
  const subseqHighlights: number[] = [];

  while (tIdx < target.length && qIdx < query.length) {
    if (target[tIdx] === query[qIdx]) {
      subseqHighlights.push(tIdx);
      qIdx++;
    }
    tIdx++;
  }

  if (qIdx === query.length) {
    // 计算离散跨度惩罚
    const span = subseqHighlights[subseqHighlights.length - 1] - subseqHighlights[0] + 1;
    const score = 180 - span * 3;
    return {
      matched: true,
      score: Math.max(score, 50),
      highlightIndices: subseqHighlights
    };
  }

  // 6. 中文释义匹配
  if (meaningZh && meaningZh.toLowerCase().includes(query)) {
    return {
      matched: true,
      score: 120,
      highlightIndices: []
    };
  }

  return {
    matched: false,
    score: 0,
    highlightIndices: []
  };
}
