import React from 'react';
import { Volume2, Sparkles, Clock, Compass } from 'lucide-react';
import { WordForms } from '../types/word';
import { buildWordForms, isVerbPos, isAdjectivePos } from '../utils/wordForms';
import { playWordAudio } from '../services/ttsService';

interface WordFormsBadgeProps {
  word: string;
  partOfSpeech: string;
  forms?: WordForms;
  variant?: 'compact' | 'detailed' | 'pill';
  className?: string;
}

export const WordFormsBadge: React.FC<WordFormsBadgeProps> = ({
  word,
  partOfSpeech,
  forms: propForms,
  variant = 'compact',
  className = '',
}) => {
  // 如果当前数据尚未生成 forms，则即时自动推导补全
  const forms = propForms && (propForms.past || propForms.adverb) 
    ? propForms 
    : buildWordForms(word, partOfSpeech);

  const isVerb = isVerbPos(partOfSpeech) || Boolean(forms.past);
  const isAdj = isAdjectivePos(partOfSpeech) || Boolean(forms.adverb);

  // 如果既不是动词也不是形容词，且没有任何形态变化，则不渲染
  if (!isVerb && !isAdj) {
    return null;
  }

  // 1. 卡片内极简紧凑单行形式 (Compact Variant)
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 text-[10px] ${className}`} onClick={(e) => e.stopPropagation()}>
        {/* 动词时态 */}
        {isVerb && forms.past && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40 font-mono">
            <span className="font-sans opacity-70 text-[9px]">过去:</span>
            <span className="font-bold">{forms.past}</span>
            {forms.pastParticiple && forms.pastParticiple !== forms.past && (
              <>
                <span className="font-sans opacity-50">/</span>
                <span className="font-bold">{forms.pastParticiple}</span>
              </>
            )}
            {forms.presentParticiple && (
              <>
                <span className="font-sans opacity-70 text-[9px] ml-1">进行:</span>
                <span>{forms.presentParticiple}</span>
              </>
            )}
          </div>
        )}

        {/* 形容词副词 */}
        {isAdj && forms.adverb && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 font-mono">
            <span className="font-sans opacity-70 text-[9px]">副词:</span>
            <span className="font-bold">{forms.adverb}</span>
          </div>
        )}
      </div>
    );
  }

  // 2. 药丸小标签样式 (Pill Variant)
  if (variant === 'pill') {
    return (
      <div className={`flex flex-wrap gap-1.5 ${className}`} onClick={(e) => e.stopPropagation()}>
        {isVerb && forms.past && (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono border border-indigo-500/20">
            过去式: <b>{forms.past}</b>
          </span>
        )}
        {isAdj && forms.adverb && (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono border border-emerald-500/20">
            副词: <b>{forms.adverb}</b>
          </span>
        )}
      </div>
    );
  }

  // 3. 全景档案与详情面板展开形式 (Detailed Variant - 用于详情弹窗与翻转卡片)
  return (
    <div className={`space-y-2.5 ${className}`} onClick={(e) => e.stopPropagation()}>
      {/* 动词时态全景展板 */}
      {isVerb && (
        <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              动词时态变化 (Tenses)
            </span>
            <span className="text-[9px] text-zinc-400">点击单词可试听发音</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* 过去式 */}
            <div 
              onClick={() => forms.past && playWordAudio(forms.past.split('/')[0])}
              className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between cursor-pointer hover:border-indigo-400 active:scale-98 transition-all group"
            >
              <div>
                <span className="text-[9px] text-zinc-400 block">过去式 (Past)</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100 font-mono">
                  {forms.past || `${word}ed`}
                </span>
              </div>
              <Volume2 className="w-3.5 h-3.5 text-zinc-300 group-hover:text-indigo-600 transition-colors" />
            </div>

            {/* 过去分词 */}
            <div 
              onClick={() => forms.pastParticiple && playWordAudio(forms.pastParticiple.split('/')[0])}
              className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between cursor-pointer hover:border-indigo-400 active:scale-98 transition-all group"
            >
              <div>
                <span className="text-[9px] text-zinc-400 block">过去分词 (p.p.)</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100 font-mono">
                  {forms.pastParticiple || forms.past || `${word}ed`}
                </span>
              </div>
              <Volume2 className="w-3.5 h-3.5 text-zinc-300 group-hover:text-indigo-600 transition-colors" />
            </div>

            {/* 现在分词 */}
            <div 
              onClick={() => forms.presentParticiple && playWordAudio(forms.presentParticiple)}
              className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between cursor-pointer hover:border-indigo-400 active:scale-98 transition-all group"
            >
              <div>
                <span className="text-[9px] text-zinc-400 block">现在分词 (-ing)</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100 font-mono">
                  {forms.presentParticiple || `${word}ing`}
                </span>
              </div>
              <Volume2 className="w-3.5 h-3.5 text-zinc-300 group-hover:text-indigo-600 transition-colors" />
            </div>

            {/* 第三人称单数 */}
            <div 
              onClick={() => forms.thirdPerson && playWordAudio(forms.thirdPerson)}
              className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between cursor-pointer hover:border-indigo-400 active:scale-98 transition-all group"
            >
              <div>
                <span className="text-[9px] text-zinc-400 block">单三形式 (-s/-es)</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100 font-mono">
                  {forms.thirdPerson || `${word}s`}
                </span>
              </div>
              <Volume2 className="w-3.5 h-3.5 text-zinc-300 group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>
        </div>
      )}

      {/* 形容词副词拓展展板 */}
      {isAdj && (
        <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              形容词副词拓展 (Adverb Form)
            </span>
            <span className="text-[9px] text-zinc-400">点击单词可试听发音</span>
          </div>

          <div 
            onClick={() => forms.adverb && playWordAudio(forms.adverb)}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between cursor-pointer hover:border-emerald-400 active:scale-98 transition-all group"
          >
            <div>
              <span className="text-[9px] text-zinc-400 block">副词形式 (adv.)</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                {forms.adverb || `${word}ly`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-400 font-serif">adv.</span>
              <Volume2 className="w-4 h-4 text-zinc-300 group-hover:text-emerald-600 transition-colors" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
