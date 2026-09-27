import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, Sparkles, Volume2, Check, ArrowRight, BookOpen, Edit3, HelpCircle, Loader2 } from 'lucide-react';
import { WordItem } from '../../types/word';
import { lookupWord, getWordSuggestions, LookupResult, WordSuggestion } from '../../services/dictionaryService';
import { smartMatchWord, MatchScore } from '../../utils/searchMatcher';
import { playWordAudio } from '../../services/ttsService';
import { WordFormsBadge } from '../WordFormsBadge';
import { buildWordForms } from '../../utils/wordForms';

interface WordVaultTabProps {
  words: WordItem[];
  onAddWord: (wordData: Omit<WordItem, 'id' | 'createdAt' | 'reviewStage' | 'scheduledDay' | 'isMastered' | 'isUnremembered' | 'unrememberedCount' | 'trainingHistory'>) => void;
  onSelectWord: (word: WordItem) => void;
  isDarkMode: boolean;
}

const ALPHABET = ['全部', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

function renderHighlighted(text: string, highlightIndices: number[]) {
  if (!highlightIndices || highlightIndices.length === 0) {
    return <span>{text}</span>;
  }
  const set = new Set(highlightIndices);
  return (
    <span>
      {text.split('').map((char, i) => (
        set.has(i) ? (
          <span key={i} className="text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-500/15 rounded-xs px-0.5">
            {char}
          </span>
        ) : (
          <span key={i}>{char}</span>
        )
      ))}
    </span>
  );
}

export const WordVaultTab: React.FC<WordVaultTabProps> = ({
  words,
  onAddWord,
  onSelectWord,
}) => {
  // Input & lookup state
  const [inputWord, setInputWord] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [isEditingLookup, setIsEditingLookup] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Auto-complete suggestion state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('全部');

  // Compute live dictionary suggestions as user types in input box
  const inputSuggestions = useMemo(() => {
    return getWordSuggestions(inputWord, 6);
  }, [inputWord]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputContainerRef.current && !inputContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 【自动查找核心机制】：当用户输入单词停止输入 450ms 后，自动发起查找中文、英文原意与造句
  useEffect(() => {
    const clean = inputWord.trim();
    if (clean.length >= 2) {
      if (lookupResult && lookupResult.word.toLowerCase() === clean.toLowerCase()) {
        return;
      }
      const timer = setTimeout(() => {
        handleLookup(clean, false);
      }, 450);
      return () => clearTimeout(timer);
    } else if (clean.length === 0) {
      setLookupResult(null);
    }
  }, [inputWord]);

  // Perform word lookup
  const handleLookup = async (wordToLookup?: string, playAudio = true) => {
    const clean = (wordToLookup || inputWord).trim();
    if (!clean) return;

    setShowSuggestions(false);
    setIsLookingUp(true);
    setSaveSuccessMsg('');
    try {
      const res = await lookupWord(clean);
      setLookupResult(res);
      setInputWord(res.word);
      if (playAudio) {
        playWordAudio(res.word);
      }
    } catch (err: any) {
      console.warn('查询失败', err);
    } finally {
      setIsLookingUp(false);
    }
  };

  // Select a suggestion from the dropdown
  const handleSelectSuggestion = (s: WordSuggestion) => {
    setInputWord(s.word);
    setShowSuggestions(false);
    handleLookup(s.word, true);
  };

  // Save the looked-up word (若尚未解析完则自动一键解析并存入)
  const handleSaveWord = async () => {
    const clean = inputWord.trim();
    if (!clean) return;

    let targetResult = lookupResult;

    // 如果用户直接输入单词点击存入，而尚未完成解析，则自动实时查询并存入！
    if (!targetResult || targetResult.word.toLowerCase() !== clean.toLowerCase()) {
      setIsLookingUp(true);
      try {
        targetResult = await lookupWord(clean);
        setLookupResult(targetResult);
      } catch (err: any) {
        alert(err.message || '查询解析失败，请检查网络');
        setIsLookingUp(false);
        return;
      }
      setIsLookingUp(false);
    }

    if (!targetResult) return;

    // Check if word already exists
    const existing = words.find(w => w.word.toLowerCase() === targetResult!.word.toLowerCase());
    if (existing) {
      if (!confirm(`单词 "${targetResult.word}" 已经在词库中了，确定再次存入吗？`)) {
        return;
      }
    }

    onAddWord({
      word: targetResult.word,
      phonetic: targetResult.phonetic,
      partOfSpeech: targetResult.partOfSpeech,
      meaningZh: targetResult.meaningZh,
      meaningEn: targetResult.meaningEn,
      exampleEn: targetResult.exampleEn,
      exampleZh: targetResult.exampleZh,
      forms: targetResult.forms || buildWordForms(targetResult.word, targetResult.partOfSpeech),
    });

    setSaveSuccessMsg(`已成功自动查找释义与造句并存入 "${targetResult.word}"！`);
    setTimeout(() => setSaveSuccessMsg(''), 3500);

    // Reset input
    setInputWord('');
    setLookupResult(null);
    setIsEditingLookup(false);
  };

  // Smart filtered words by search query and letter category
  const filteredWordsWithMatch = useMemo(() => {
    const list: { word: WordItem; match: MatchScore }[] = [];

    for (const w of words) {
      const match = smartMatchWord(w.word, w.meaningZh, searchQuery);
      if (!match.matched) continue;

      const firstChar = w.word.charAt(0).toUpperCase();
      const matchesLetter = selectedLetter === '全部' || firstChar === selectedLetter || searchQuery.trim().length > 0;
      if (!matchesLetter) continue;

      list.push({ word: w, match });
    }

    return list.sort((a, b) => {
      if (searchQuery.trim().length > 0) {
        return b.match.score - a.match.score || a.word.word.localeCompare(b.word.word);
      }
      return a.word.word.localeCompare(b.word.word);
    });
  }, [words, searchQuery, selectedLetter]);

  // Letter count badge mapping
  const letterCounts = useMemo(() => {
    const map: Record<string, number> = {};
    words.forEach(w => {
      const char = w.word.charAt(0).toUpperCase();
      map[char] = (map[char] || 0) + 1;
    });
    return map;
  }, [words]);

  return (
    <div className="space-y-4 pb-24">
      {/* SECTION 1: 存入单词输入与自动解析区 */}
      <section className="rounded-3xl p-4.5 backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-white/40 dark:border-zinc-800/80 shadow-lg relative">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              存入新单词
            </h2>
          </div>
          <span className="text-[10px] text-zinc-400">
            自动查找中英双释义 · 权威英文原意 · 造句
          </span>
        </div>

        {/* Input & Lookup Form with Auto-complete Dropdown */}
        <div ref={inputContainerRef} className="relative">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleLookup(inputWord, true); }} 
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => {
                  setInputWord(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="输入英文单词 (如 aesthetic，自动查找释义造句)..."
                className="w-full py-2.5 pl-3.5 pr-8 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner placeholder:text-zinc-400"
              />
              {inputWord && (
                <button
                  type="button"
                  onClick={() => { setInputWord(''); setLookupResult(null); setShowSuggestions(false); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleSaveWord}
              disabled={!inputWord.trim() || isLookingUp}
              className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0"
              title="一键自动查找并存入"
            >
              {isLookingUp ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>查找中...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>存入</span>
                </>
              )}
            </button>
          </form>

          {/* Real-time Match Suggestions Dropdown (e.g. typing "as" matches "aesthetic") */}
          {showSuggestions && inputWord.trim().length > 0 && inputSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-indigo-200/80 dark:border-zinc-700 shadow-xl overflow-hidden animate-in fade-in duration-150">
              <div className="px-3 py-1.5 bg-indigo-50/70 dark:bg-zinc-800/50 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-between border-b border-indigo-100 dark:border-zinc-800">
                <span>词典匹配建议 (点击即刻解析)</span>
                <span>{inputSuggestions.length} 个匹配项</span>
              </div>
              <div className="max-h-52 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {inputSuggestions.map((item) => (
                  <button
                    key={item.word}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-3.5 py-2 text-left hover:bg-indigo-50/80 dark:hover:bg-zinc-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {renderHighlighted(item.word, item.highlightIndices)}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-serif">
                          {item.partOfSpeech}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {item.phonetic}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
                        {item.meaningZh}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-indigo-500 transition-colors shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Real-time looking up hint */}
        {isLookingUp && !lookupResult && (
          <div className="mt-2.5 p-2 rounded-xl bg-indigo-50/70 dark:bg-zinc-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-medium flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>正在自动获取「{inputWord}」的权威中文、原本英文定义及应用造句...</span>
          </div>
        )}

        {/* Save Success Toast */}
        {saveSuccessMsg && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Looked-up Word Preview & Confirmation Card */}
        {lookupResult && (
          <div className="mt-3.5 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 animate-in slide-in-from-top-2 duration-200">
            {/* Word Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-zinc-900 dark:text-white">
                  {lookupResult.word}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-serif font-bold">
                  {lookupResult.partOfSpeech}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  {lookupResult.phonetic}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsEditingLookup(!isEditingLookup)}
                  className="p-1.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs shadow-xs hover:bg-zinc-100"
                  title="微调释义或例句"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => playWordAudio(lookupResult.word)}
                  className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs active:scale-95 hover:bg-indigo-700 transition-transform"
                  title="真人纯正发音"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* If user looked up "as", but might want "aesthetic", show intelligent hint */}
            {lookupResult.word.toLowerCase() === 'as' && (
              <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  您是要找 <b>aesthetic</b> (美学的；审美的) 吗？
                </span>
                <button
                  type="button"
                  onClick={() => handleLookup('aesthetic', true)}
                  className="px-2 py-1 rounded-lg bg-amber-500 text-white font-medium text-[11px] shadow-xs hover:bg-amber-600 transition-colors"
                >
                  切换为 aesthetic
                </button>
              </div>
            )}

            {/* Editable or Standard Display Mode */}
            {isEditingLookup ? (
              <div className="mt-2.5 space-y-2 text-xs">
                {/* 词性与中文释义精细编辑 */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <label className="text-[10px] text-zinc-500 font-semibold block mb-0.5">词性标注</label>
                      <input
                        type="text"
                        value={lookupResult.partOfSpeech}
                        onChange={(e) => setLookupResult({ ...lookupResult, partOfSpeech: e.target.value })}
                        placeholder="如 v. / n."
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs font-serif font-bold text-indigo-600 dark:text-indigo-400"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-zinc-500 font-semibold block mb-0.5">中文释义</label>
                      <input
                        type="text"
                        value={lookupResult.meaningZh}
                        onChange={(e) => setLookupResult({ ...lookupResult, meaningZh: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs"
                      />
                    </div>
                  </div>
                  {/* 快捷词性选择胶囊 */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    <span className="text-[9px] text-zinc-400 shrink-0">快捷词性:</span>
                    {['v.', 'n.', 'adj.', 'adv.', 'v. / n.', 'n. / v.', 'adj. / adv.', 'adj. / n.'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setLookupResult({ ...lookupResult, partOfSpeech: p })}
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-serif transition-colors ${
                          lookupResult.partOfSpeech === p
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-indigo-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold block mb-0.5">英文原本释义 (Original Definition)</label>
                  <textarea
                    rows={2}
                    value={lookupResult.meaningEn}
                    onChange={(e) => setLookupResult({ ...lookupResult, meaningEn: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold block mb-0.5">简短英文应用例句 (Example)</label>
                  <input
                    type="text"
                    value={lookupResult.exampleEn}
                    onChange={(e) => setLookupResult({ ...lookupResult, exampleEn: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold block mb-0.5">例句中文翻译</label>
                  <input
                    type="text"
                    value={lookupResult.exampleZh}
                    onChange={(e) => setLookupResult({ ...lookupResult, exampleZh: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-2.5 space-y-2">
                {/* 中文翻译 */}
                <div className="text-xs">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {lookupResult.meaningZh}
                  </span>
                </div>

                {/* 英文原本释义 */}
                <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-indigo-100 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-300">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 block mb-0.5">
                    Original English Definition (英文原本释义)
                  </span>
                  <p className="leading-snug">{lookupResult.meaningEn}</p>
                </div>

                {/* 简短应用举例与造句 */}
                <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-indigo-100 dark:border-zinc-800 text-[11px]">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 block mb-0.5">
                    Concise Example & Usage (应用例句)
                  </span>
                  <p className="italic text-zinc-700 dark:text-zinc-200 leading-snug">
                    "{lookupResult.exampleEn}"
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[10px] mt-0.5">
                    {lookupResult.exampleZh}
                  </p>
                </div>

                {/* 动词时态与形容词副词形式展板 */}
                <WordFormsBadge
                  word={lookupResult.word}
                  partOfSpeech={lookupResult.partOfSpeech}
                  forms={lookupResult.forms}
                  variant="detailed"
                  className="mt-1"
                />
              </div>
            )}

            {/* Action to Save */}
            <button
              type="button"
              onClick={handleSaveWord}
              className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>存入单词库 (排入第2/4/7/15天训练)</span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 2: 字母搜索匹配 & 首字母分类 */}
      <section className="space-y-2.5">
        {/* Alphabetical Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="字母搜索匹配 (如 'as' 匹配 'aesthetic', 或中文)..."
            className="w-full py-2.5 pl-9 pr-8 rounded-2xl bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border border-white/40 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs"
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

        {/* 首字母分类导航 (A-Z First-Letter Categorization) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 no-scrollbar">
          {ALPHABET.map((letter) => {
            const isSelected = selectedLetter === letter;
            const count = letter === '全部' ? words.length : (letterCounts[letter] || 0);

            return (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : count > 0
                      ? 'bg-white/60 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800'
                      : 'bg-white/30 dark:bg-zinc-800/30 text-zinc-400 dark:text-zinc-600'
                }`}
              >
                <span>{letter}</span>
                {count > 0 && (
                  <span className={`text-[9px] px-1 rounded-full ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-zinc-200/80 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: 已存单词列表卡片 */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            {searchQuery.trim()
              ? `包含/模糊匹配 '${searchQuery}' 的词汇 (${filteredWordsWithMatch.length})`
              : selectedLetter === '全部'
                ? `全部存入词汇 (${filteredWordsWithMatch.length})`
                : `首字母 '${selectedLetter}' 分组 (${filteredWordsWithMatch.length})`
            }
          </span>
          <span className="text-[11px]">点击卡片可查看详情或发音</span>
        </div>

        {filteredWordsWithMatch.length === 0 ? (
          <div className="py-12 text-center rounded-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/20 dark:border-zinc-800 text-zinc-400 text-xs">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-indigo-400" />
            <p>暂无匹配的单词</p>
            <p className="text-[10px] mt-1 text-zinc-400">可尝试在上方输入框存入新单词</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {filteredWordsWithMatch.map(({ word: item, match }) => (
              <div
                key={item.id}
                onClick={() => onSelectWord(item)}
                className="group relative p-3.5 rounded-2xl backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 hover:bg-white/90 dark:hover:bg-zinc-900/90 border border-white/40 dark:border-zinc-800/80 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {renderHighlighted(item.word, match.highlightIndices)}
                      </h3>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-serif">
                        {item.partOfSpeech}
                      </span>
                      {item.phonetic && (
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {item.phonetic}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-1 line-clamp-1">
                      {item.meaningZh}
                    </p>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-sans">
                      {item.meaningEn}
                    </p>
                    <WordFormsBadge
                      word={item.word}
                      partOfSpeech={item.partOfSpeech}
                      forms={item.forms}
                      variant="compact"
                      className="mt-1"
                    />
                  </div>

                  {/* Right Tags & Pronounce */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playWordAudio(item.word);
                      }}
                      className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title="朗读发音"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    {item.isMastered ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                        已熟记
                      </span>
                    ) : item.isUnremembered ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                        未记住
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                        第 {item.scheduledDay} 天
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
