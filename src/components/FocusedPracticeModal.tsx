import React, { useState } from 'react';
import { X, Volume2, Eye, Check, RotateCcw, Sparkles, Award } from 'lucide-react';
import { WordItem } from '../types/word';
import { playWordAudio, playSentenceAudio } from '../services/ttsService';
import { WordFormsBadge } from './WordFormsBadge';
import confetti from 'canvas-confetti';

interface FocusedPracticeModalProps {
  isOpen: boolean;
  words: WordItem[];
  onClose: () => void;
  onConquerWord: (id: string) => void;
}

export const FocusedPracticeModal: React.FC<FocusedPracticeModalProps> = ({
  isOpen,
  words,
  onClose,
  onConquerWord,
}) => {
  if (!isOpen || words.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [conqueredCount, setConqueredCount] = useState(0);

  const currentWord = words[currentIndex];

  const handleConquer = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setConqueredCount(prev => prev + 1);
    onConquerWord(currentWord.id);
    nextCard();
  };

  const handleNext = () => {
    nextCard();
  };

  const nextCard = () => {
    setIsRevealed(false);
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed drill
      confetti({
        particleCount: 100,
        spread: 80,
      });
      setCurrentIndex(-1); // Finished flag
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setConqueredCount(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-5 shadow-2xl border border-white/20 text-zinc-800 dark:text-zinc-100 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
              生词专项闪卡
            </span>
            {currentIndex >= 0 && (
              <span className="text-xs text-zinc-400 font-mono">
                {currentIndex + 1} / {words.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {currentIndex === -1 ? (
          /* Finished State */
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500 text-white flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                专项重温训练完成！
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                本次训练已攻克 {conqueredCount} 个生词，记忆更上一层楼！
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重新训练</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-2xl bg-amber-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>关闭返回</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Card */
          <div className="space-y-4">
            <div 
              onClick={() => setIsRevealed(!isRevealed)}
              className="min-h-[220px] p-5 rounded-2xl bg-amber-50/50 dark:bg-zinc-800/40 border border-amber-200/60 dark:border-zinc-700/60 flex flex-col justify-between cursor-pointer select-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-600 font-bold tracking-wider uppercase">
                  未记住单词专注复习
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playWordAudio(currentWord.word);
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-700 text-amber-600 shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center py-4">
                <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                  {currentWord.word}
                </h3>
                {currentWord.phonetic && (
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">
                    {currentWord.phonetic}
                  </p>
                )}
              </div>

              {isRevealed ? (
                <div className="space-y-1.5 pt-2 border-t border-amber-200/40 text-xs">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">
                    <span className="font-serif mr-1">{currentWord.partOfSpeech}</span>
                    {currentWord.meaningZh}
                  </p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    {currentWord.meaningEn}
                  </p>
                  <div className="flex items-start justify-between gap-1.5 text-[11px] italic text-zinc-500">
                    <span className="flex-1">"{currentWord.exampleEn}"</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSentenceAudio(currentWord.exampleEn);
                      }}
                      className="shrink-0 p-1 rounded-lg bg-white dark:bg-zinc-700 text-amber-600 shadow-2xs hover:bg-amber-100 transition-colors not-italic"
                      title="朗读例句"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                  <WordFormsBadge
                    word={currentWord.word}
                    partOfSpeech={currentWord.partOfSpeech}
                    forms={currentWord.forms}
                    variant="detailed"
                    className="mt-2"
                  />
                </div>
              ) : (
                <div className="text-center text-xs text-amber-600/70 font-medium flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>点击揭晓释义</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 font-medium text-xs"
              >
                下一个 (保留在生词库)
              </button>
              <button
                onClick={handleConquer}
                className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-md active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>已记住 (移出生词库)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
