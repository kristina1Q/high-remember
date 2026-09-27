import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Brain, Volume2, Eye, Check, Sparkles, X, RotateCcw, Award, ChevronRight } from 'lucide-react';
import { WordItem, ReviewInterval } from '../../types/word';
import { playWordAudio, playSentenceAudio } from '../../services/ttsService';
import { WordFormsBadge } from '../WordFormsBadge';
import confetti from 'canvas-confetti';

interface TrainingTabProps {
  words: WordItem[];
  onRemembered: (wordId: string) => void;
  onMastered: (wordId: string) => void;
  onUnremembered: (wordId: string) => void;
  onGoToUnrememberedTab: () => void;
  isDarkMode: boolean;
}

type FilterInterval = 'all' | ReviewInterval;

export const TrainingTab: React.FC<TrainingTabProps> = ({
  words,
  onRemembered,
  onMastered,
  onUnremembered,
  onGoToUnrememberedTab,
}) => {
  // Selected interval filter (all, Day 2, Day 4, Day 7, Day 15)
  const [selectedInterval, setSelectedInterval] = useState<FilterInterval>('all');
  
  // Card flip state (revealing definition/example)
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Current card index in active session
  const [currentIndex, setCurrentIndex] = useState(0);

  // Active training session queue snapshot (训练会话独立快照，防止训练中因状态更新导致队列突变和 undefined 白屏)
  const [sessionQueue, setSessionQueue] = useState<WordItem[]>([]);

  // Session results summary
  const [sessionStats, setSessionStats] = useState({
    remembered: 0,
    mastered: 0,
    unremembered: 0,
    total: 0,
  });
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Helper to get eligible words for an interval from the master word list
  const getEligibleWords = useCallback((interval: FilterInterval, wordList: WordItem[]) => {
    return wordList.filter((w) => {
      if (w.isMastered) return false; // 熟记则不用在后面的训练中出现
      if (interval === 'all') return true;
      return w.scheduledDay === interval;
    });
  }, []);

  // Day counts for pills (always reactive to global words state)
  const intervalCounts = useMemo(() => {
    const counts = { all: 0, 2: 0, 4: 0, 7: 0, 15: 0 };
    words.forEach(w => {
      if (!w.isMastered) {
        counts.all++;
        if (counts[w.scheduledDay] !== undefined) {
          counts[w.scheduledDay]++;
        }
      }
    });
    return counts;
  }, [words]);

  // Start a fresh, stable training session for a specified interval
  const startNewSession = useCallback((interval: FilterInterval, wordList: WordItem[]) => {
    const eligible = getEligibleWords(interval, wordList);
    setSessionQueue(eligible);
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsSessionFinished(false);
    setSessionStats({ remembered: 0, mastered: 0, unremembered: 0, total: 0 });
  }, [getEligibleWords]);

  // Initialize or re-initialize session when interval tab changes
  const handleSelectInterval = (interval: FilterInterval) => {
    setSelectedInterval(interval);
    startNewSession(interval, words);
  };

  // Sync session queue initially or if currently empty and words became available
  useEffect(() => {
    if (sessionQueue.length === 0 && !isSessionFinished) {
      const eligible = getEligibleWords(selectedInterval, words);
      if (eligible.length > 0) {
        setSessionQueue(eligible);
        setCurrentIndex(0);
      }
    }
  }, [words, selectedInterval, sessionQueue.length, isSessionFinished, getEligibleWords]);

  // Current active word with full undefined safety
  const currentWord: WordItem | undefined = sessionQueue[currentIndex];

  const nextCard = () => {
    setIsRevealed(false);
    if (currentIndex + 1 >= sessionQueue.length) {
      setIsSessionFinished(true);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Handler for "熟记" (熟记则不用在后面的训练中出现)
  const handleMastered = () => {
    if (!currentWord) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setSessionStats(prev => ({ ...prev, mastered: prev.mastered + 1, total: prev.total + 1 }));
    onMastered(currentWord.id);
    nextCard();
  };

  // Handler for "记住" (推进艾宾浩斯下一个复习天数)
  const handleRemembered = () => {
    if (!currentWord) return;
    setSessionStats(prev => ({ ...prev, remembered: prev.remembered + 1, total: prev.total + 1 }));
    onRemembered(currentWord.id);
    nextCard();
  };

  // Handler for "未记住" (未记住则放入未记住的单词板块)
  const handleUnremembered = () => {
    if (!currentWord) return;
    setSessionStats(prev => ({ ...prev, unremembered: prev.unremembered + 1, total: prev.total + 1 }));
    onUnremembered(currentWord.id);
    nextCard();
  };

  const restartTraining = () => {
    startNewSession(selectedInterval, words);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Training Day Selector */}
      <section className="rounded-3xl p-3.5 backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-white/40 dark:border-zinc-800/80 shadow-md">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              艾宾浩斯复习周期
            </span>
          </div>
          <span className="text-[10px] text-zinc-400">
            第2天 · 第4天 · 第7天 · 第15天
          </span>
        </div>

        {/* Interval Filter Pills */}
        <div className="grid grid-cols-5 gap-1.5">
          <button
            onClick={() => handleSelectInterval('all')}
            className={`py-2 px-1 rounded-2xl text-[11px] font-semibold transition-all active:scale-95 flex flex-col items-center ${
              selectedInterval === 'all'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <span>全部待训</span>
            <span className="text-[9px] opacity-80 mt-0.5">{intervalCounts.all}</span>
          </button>

          {([2, 4, 7, 15] as ReviewInterval[]).map((day) => (
            <button
              key={day}
              onClick={() => handleSelectInterval(day)}
              className={`py-2 px-1 rounded-2xl text-[11px] font-semibold transition-all active:scale-95 flex flex-col items-center ${
                selectedInterval === day
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <span>第{day}天</span>
              <span className="text-[9px] opacity-80 mt-0.5">{intervalCounts[day]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Training Area */}
      {isSessionFinished ? (
        /* Session Completed Screen */
        <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border border-white/40 dark:border-zinc-800 shadow-xl text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              🎉 本轮训练圆满完成！
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              科学记忆曲线已更新，持之以恒，终成大家！
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
            <div className="p-2">
              <span className="text-xs text-zinc-500 block mb-0.5">记住进阶</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {sessionStats.remembered}
              </span>
            </div>
            <div className="p-2">
              <span className="text-xs text-zinc-500 block mb-0.5">完全熟记</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {sessionStats.mastered}
              </span>
            </div>
            <div className="p-2">
              <span className="text-xs text-zinc-500 block mb-0.5">未记住待攻克</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {sessionStats.unremembered}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={restartTraining}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>再练一遍本组</span>
            </button>

            {sessionStats.unremembered > 0 && (
              <button
                onClick={onGoToUnrememberedTab}
                className="w-full py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>前往【未记住的单词】板块查看</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : !currentWord || sessionQueue.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center rounded-3xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/40 dark:border-zinc-800 text-zinc-400 text-xs space-y-2">
          <Sparkles className="w-10 h-10 mx-auto text-emerald-500 opacity-60" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {selectedInterval === 'all'
              ? '当前暂无待训练单词'
              : `第 ${selectedInterval} 天队列中没有待训练单词`}
          </p>
          <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
            你存入的单词或被标记为熟记的单词都已归档。可前往【存入单词】添加新词。
          </p>
        </div>
      ) : (
        /* Active Flashcard Display - 绝对安全保障 currentWord 存在 */
        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs px-2 text-zinc-500 dark:text-zinc-400">
            <span>训练进度</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              {currentIndex + 1} / {sessionQueue.length}
            </span>
          </div>

          {/* Flashcard container */}
          <div 
            onClick={() => setIsRevealed(!isRevealed)}
            className="group relative min-h-[300px] p-6 rounded-3xl backdrop-blur-2xl bg-white/85 dark:bg-zinc-900/85 border border-white/50 dark:border-zinc-800 shadow-xl flex flex-col justify-between cursor-pointer transition-all hover:shadow-2xl select-none"
          >
            {/* Card Top: 标记天数 & 音标发音 */}
            <div className="flex items-center justify-between">
              {/* 标记天数 - 用户严格要求 */}
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
                <span>📅 第 {currentWord.scheduledDay} 天训练</span>
              </div>

              {/* Audio button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playWordAudio(currentWord.word);
                }}
                className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-600 text-zinc-600 dark:text-zinc-300 transition-colors shadow-xs active:scale-95"
                title="纯正发音"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Card Center: 只展示单词英文原文 - 用户严格要求 */}
            <div className="py-8 text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {currentWord.word}
              </h2>
              {currentWord.phonetic && (
                <p className="text-sm font-mono text-zinc-400">
                  {currentWord.phonetic}
                </p>
              )}
            </div>

            {/* Revealed Answer & Examples (Flipped State) */}
            {isRevealed ? (
              <div className="space-y-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/80 animate-in fade-in duration-200">
                {/* Chinese Meaning */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-serif font-bold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {currentWord.partOfSpeech}
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {currentWord.meaningZh}
                  </span>
                </div>

                {/* English Original Meaning */}
                <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                    Original English
                  </span>
                  {currentWord.meaningEn}
                </div>

                {/* Example */}
                <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      语境例句
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSentenceAudio(currentWord.exampleEn);
                      }}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 active:scale-95 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 transition-colors"
                      title="朗读例句"
                    >
                      <Volume2 className="w-3 h-3" /> 读句
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 italic">
                    "{currentWord.exampleEn}"
                  </p>
                  <p className="text-[10px] text-zinc-400 not-italic mt-0.5">
                    {currentWord.exampleZh}
                  </p>
                </div>

                {/* 动词时态变化 & 形容词副词拓展 */}
                <WordFormsBadge
                  word={currentWord.word}
                  partOfSpeech={currentWord.partOfSpeech}
                  forms={currentWord.forms}
                  variant="detailed"
                />
              </div>
            ) : (
              /* Tap hint to reveal */
              <div className="text-center pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  <span>点击卡片揭晓释义与例句</span>
                </span>
              </div>
            )}
          </div>

          {/* Three Choice Buttons: 用户严格要求给出 记住，熟记，未记住 */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {/* 未记住 */}
            <button
              onClick={handleUnremembered}
              className="py-3 px-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-800/80 text-rose-600 dark:text-rose-300 text-xs font-bold flex flex-col items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                <X className="w-4 h-4 stroke-[3]" />
              </div>
              <span>未记住</span>
              <span className="text-[9px] opacity-70 font-normal">移入生词库</span>
            </button>

            {/* 记住 */}
            <button
              onClick={handleRemembered}
              className="py-3 px-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex flex-col items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span>记住</span>
              <span className="text-[9px] opacity-70 font-normal">推进下一轮</span>
            </button>

            {/* 熟记 */}
            <button
              onClick={handleMastered}
              className="py-3 px-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-300 text-xs font-bold flex flex-col items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>熟记</span>
              <span className="text-[9px] opacity-70 font-normal">后续不再出现</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
