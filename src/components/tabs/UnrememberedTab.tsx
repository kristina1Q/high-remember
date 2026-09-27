import React, { useState, useMemo } from 'react';
import { BookmarkX, Search, Volume2, CheckCircle2, RotateCcw, Sparkles, BookOpen, AlertCircle, Play } from 'lucide-react';
import { WordItem } from '../../types/word';
import { playWordAudio, playSentenceAudio } from '../../services/ttsService';
import { WordFormsBadge } from '../WordFormsBadge';
import confetti from 'canvas-confetti';

interface UnrememberedTabProps {
  words: WordItem[];
  onRemoveUnremembered: (id: string) => void;
  onRequeueTraining: (id: string) => void;
  onMarkMastered: (id: string) => void;
  onSelectWord: (word: WordItem) => void;
  onStartFocusedPractice: (unrememberedList: WordItem[]) => void;
  isDarkMode: boolean;
}

export const UnrememberedTab: React.FC<UnrememberedTabProps> = ({
  words,
  onRemoveUnremembered,
  onRequeueTraining,
  onMarkMastered,
  onSelectWord,
  onStartFocusedPractice,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Unremembered words list (not yet mastered)
  const unrememberedList = useMemo(() => {
    return words.filter(w => w.isUnremembered && !w.isMastered);
  }, [words]);

  // Filtered by search
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return unrememberedList;
    const q = searchQuery.toLowerCase().trim();
    return unrememberedList.filter(w => 
      w.word.toLowerCase().includes(q) ||
      w.meaningZh.toLowerCase().includes(q)
    );
  }, [unrememberedList, searchQuery]);

  const handleMaster = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onMarkMastered(id);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Overview Banner */}
      <section className="rounded-3xl p-4.5 backdrop-blur-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/20 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-amber-500 text-white shadow-xs">
                <BookmarkX className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  未记住的生词库
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  训练中标记为“未记住”的单词自动收录于此
                </p>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-500/30">
            {unrememberedList.length} 词待攻克
          </span>
        </div>

        {/* Start Focused Drill Button */}
        {unrememberedList.length > 0 && (
          <button
            onClick={() => onStartFocusedPractice(unrememberedList)}
            className="w-full mt-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>开启生词专项闪卡训练 ({unrememberedList.length} 词)</span>
          </button>
        )}
      </section>

      {/* Search Input */}
      {unrememberedList.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索未记住的生词..."
            className="w-full py-2.5 pl-9 pr-8 rounded-2xl bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border border-white/40 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Words List */}
      <section className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/20 dark:border-zinc-800 text-zinc-400 text-xs">
            {unrememberedList.length === 0 ? (
              <>
                <Sparkles className="w-10 h-10 mx-auto mb-2.5 text-amber-500 opacity-60" />
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  太棒了！当前没有未记住的生词
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  在【单词训练】中如果遇到记不清的单词，选“未记住”就会自动归入这里
                </p>
              </>
            ) : (
              <>
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-400" />
                <p>未找到匹配的生词</p>
              </>
            )}
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectWord(item)}
              className="p-4 rounded-3xl backdrop-blur-md bg-white/75 dark:bg-zinc-900/75 border border-amber-200/50 dark:border-amber-900/40 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.99] space-y-2.5"
            >
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {item.word}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-serif font-bold">
                      {item.partOfSpeech}
                    </span>
                    {item.phonetic && (
                      <span className="text-xs text-zinc-400 font-mono">
                        {item.phonetic}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
                    {item.meaningZh}
                  </p>
                  <WordFormsBadge
                    word={item.word}
                    partOfSpeech={item.partOfSpeech}
                    forms={item.forms}
                    variant="compact"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playWordAudio(item.word);
                    }}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-50 text-zinc-600 dark:text-zinc-300 hover:text-amber-600 transition-colors"
                    title="发音"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Original English Definition */}
              <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-0.5">
                  原本英文释义
                </span>
                {item.meaningEn}
              </div>

              {/* Example */}
              <div className="flex items-start justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                <span className="flex-1">"{item.exampleEn}"</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playSentenceAudio(item.exampleEn);
                  }}
                  className="shrink-0 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-zinc-500 hover:text-amber-600 transition-colors not-italic"
                  title="朗读例句"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                {/* 已攻克 / 移出 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveUnremembered(item.id);
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>已攻克/移出</span>
                </button>

                {/* 重新纳入训练 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequeueTraining(item.id);
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重新纳入训练</span>
                </button>

                {/* 熟记 */}
                <button
                  onClick={(e) => handleMaster(item.id, e)}
                  className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>熟记</span>
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
