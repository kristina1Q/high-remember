import React, { useState, useEffect } from 'react';
import { X, Volume2, Calendar, Award, AlertCircle, Trash2, CheckCircle2, Edit3, Check, RotateCcw } from 'lucide-react';
import { WordItem } from '../types/word';
import { playWordAudio, playSentenceAudio, stopAllAudio } from '../services/ttsService';
import { formatPartOfSpeech } from '../services/dictionaryService';
import { WordFormsBadge } from './WordFormsBadge';
import { buildWordForms } from '../utils/wordForms';

interface WordDetailModalProps {
  word: WordItem | null;
  onClose: () => void;
  onDeleteWord: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onToggleUnremembered: (id: string) => void;
  onUpdateWord?: (word: WordItem) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  onClose,
  onDeleteWord,
  onToggleMastered,
  onToggleUnremembered,
  onUpdateWord,
}) => {
  if (!word) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editPos, setEditPos] = useState(word.partOfSpeech || 'n.');
  const [editMeaningZh, setEditMeaningZh] = useState(word.meaningZh || '');
  const [editMeaningEn, setEditMeaningEn] = useState(word.meaningEn || '');
  const [editExampleEn, setEditExampleEn] = useState(word.exampleEn || '');
  const [editExampleZh, setEditExampleZh] = useState(word.exampleZh || '');
  const [saveToast, setSaveToast] = useState(false);
  const [isSpeakingSentence, setIsSpeakingSentence] = useState(false);

  useEffect(() => {
    if (word) {
      setEditPos(word.partOfSpeech || 'n.');
      setEditMeaningZh(word.meaningZh || '');
      setEditMeaningEn(word.meaningEn || '');
      setEditExampleEn(word.exampleEn || '');
      setEditExampleZh(word.exampleZh || '');
      setIsEditing(false);
      setIsSpeakingSentence(false);
    }
  }, [word]);

  const handleSaveEdit = () => {
    if (!onUpdateWord) return;
    const pos = formatPartOfSpeech(editPos);
    const updated: WordItem = {
      ...word,
      partOfSpeech: pos,
      meaningZh: editMeaningZh.trim(),
      meaningEn: editMeaningEn.trim(),
      exampleEn: editExampleEn.trim(),
      exampleZh: editExampleZh.trim(),
      forms: buildWordForms(word.word, pos),
    };
    onUpdateWord(updated);
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const dateStr = new Date(word.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm max-h-[88vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-5 shadow-2xl border border-white/20 text-zinc-800 dark:text-zinc-100 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              单词全景档案
            </span>
            {saveToast && (
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                <Check className="w-3 h-3" /> 已保存
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 rounded-xl transition-colors text-xs flex items-center gap-1 ${
                isEditing
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title={isEditing ? '取消编辑' : '编辑词性与释义'}
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-[11px]">{isEditing ? '取消' : '编辑'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Word Title & Audio */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {word.word}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-serif font-bold">
                {isEditing ? editPos : word.partOfSpeech}
              </span>
            </div>
            {word.phonetic && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                {word.phonetic}
              </p>
            )}
          </div>
          <button
            onClick={() => playWordAudio(word.word)}
            className="p-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white shadow-md transition-all"
            title="真人纯正发音"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Editing Mode */}
        {isEditing ? (
          <div className="space-y-3 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-zinc-800/60 border border-indigo-200/60 dark:border-zinc-700 text-xs">
            {/* Part of Speech Editing */}
            <div>
              <label className="text-[10px] text-zinc-500 font-semibold block mb-1">
                词性标注 (支持多词性，如 v. / n.)
              </label>
              <input
                type="text"
                value={editPos}
                onChange={(e) => setEditPos(e.target.value)}
                placeholder="如 v. / n."
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-serif font-bold text-indigo-600 dark:text-indigo-400"
              />
              {/* Quick POS Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1.5">
                <span className="text-[9px] text-zinc-400 shrink-0">快捷:</span>
                {['v.', 'n.', 'adj.', 'adv.', 'v. / n.', 'n. / v.', 'adj. / adv.', 'adj. / n.'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setEditPos(p)}
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-serif transition-colors ${
                      editPos === p
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Chinese Meaning */}
            <div>
              <label className="text-[10px] text-zinc-500 font-semibold block mb-1">
                中文释义
              </label>
              <input
                type="text"
                value={editMeaningZh}
                onChange={(e) => setEditMeaningZh(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs"
              />
            </div>

            {/* Original English Definition */}
            <div>
              <label className="text-[10px] text-zinc-500 font-semibold block mb-1">
                原本英文释义 (English Definition)
              </label>
              <textarea
                rows={2}
                value={editMeaningEn}
                onChange={(e) => setEditMeaningEn(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs"
              />
            </div>

            {/* Example sentence */}
            <div>
              <label className="text-[10px] text-zinc-500 font-semibold block mb-1">
                应用例句 (英文)
              </label>
              <input
                type="text"
                value={editExampleEn}
                onChange={(e) => setEditExampleEn(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-semibold block mb-1">
                例句中文翻译
              </label>
              <input
                type="text"
                value={editExampleZh}
                onChange={(e) => setEditExampleZh(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveEdit}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>保存修改内容</span>
            </button>
          </div>
        ) : (
          /* Normal Display Mode */
          <>
            {/* Bilingual Definitions */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  中文释义 (Chinese)
                </span>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {word.meaningZh}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  英文原本释义 (English Definition)
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                  {word.meaningEn}
                </p>
              </div>
            </div>

            {/* Example Sentence */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                  应用例句举例 (Example)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeakingSentence) {
                      stopAllAudio();
                      setIsSpeakingSentence(false);
                    } else {
                      setIsSpeakingSentence(true);
                      playSentenceAudio(word.exampleEn, {
                        onStart: () => setIsSpeakingSentence(true),
                        onEnd: () => setIsSpeakingSentence(false),
                      });
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 ${
                    isSpeakingSentence
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-medium'
                  }`}
                  title="朗读完整例句"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeakingSentence ? 'animate-bounce' : ''}`} />
                  <span>{isSpeakingSentence ? '朗读中...' : '读句'}</span>
                </button>
              </div>
              <p className="text-xs italic text-zinc-800 dark:text-zinc-200 leading-relaxed mb-1">
                "{word.exampleEn}"
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {word.exampleZh}
              </p>
            </div>

            {/* Word Forms: Verb Tenses & Adjective Adverb Forms */}
            <WordFormsBadge
              word={word.word}
              partOfSpeech={word.partOfSpeech}
              forms={word.forms}
              variant="detailed"
            />
          </>
        )}

        {/* Training Status & Dates */}
        <div className="bg-zinc-100/60 dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> 存入时间
            </span>
            <span className="font-medium">{dateStr}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> 艾宾浩斯轮次
            </span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {word.isMastered ? '已彻底熟记' : `第 ${word.scheduledDay} 天复习队列`}
            </span>
          </div>
          {word.isUnremembered && (
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> 当前状态
              </span>
              <span className="font-semibold">未记住 (待专项重训)</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              onToggleMastered(word.id);
              onClose();
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 ${
              word.isMastered
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{word.isMastered ? '取消熟记' : '标记熟记'}</span>
          </button>

          <button
            onClick={() => {
              onToggleUnremembered(word.id);
              onClose();
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 ${
              word.isUnremembered
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>{word.isUnremembered ? '移出未记' : '设为未记'}</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`确定要从词库中删除单词 "${word.word}" 吗？`)) {
                onDeleteWord(word.id);
                onClose();
              }
            }}
            className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition-colors active:scale-95"
            title="删除单词"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
