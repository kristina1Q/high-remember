import React from 'react';
import { BookPlus, BookmarkX, Brain } from 'lucide-react';
import { ActiveTab } from '../types/word';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  unrememberedCount: number;
  dueTrainingCount: number;
  isDarkMode: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  unrememberedCount,
  dueTrainingCount,
  isDarkMode,
}) => {
  return (
    <nav className={`w-full fixed bottom-0 left-0 right-0 z-40 transition-all ${
      isDarkMode 
        ? 'bg-zinc-900/85 border-t border-zinc-800/80 text-zinc-400' 
        : 'bg-white/80 border-t border-zinc-200/60 text-zinc-500'
    } backdrop-blur-xl pb-safe`}>
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {/* Tab 1: 存入单词 */}
        <button
          onClick={() => onChangeTab('vault')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
            activeTab === 'vault'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <BookPlus className={`w-5 h-5 transition-transform ${activeTab === 'vault' ? 'scale-110' : ''}`} />
          </div>
          <span className="text-[11px] mt-1 tracking-tight">存入单词</span>
        </button>

        {/* Tab 2: 未记住的单词 */}
        <button
          onClick={() => onChangeTab('unremembered')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
            activeTab === 'unremembered'
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <BookmarkX className={`w-5 h-5 transition-transform ${activeTab === 'unremembered' ? 'scale-110' : ''}`} />
            {unrememberedCount > 0 && (
              <span className="absolute -top-1 -right-2.5 px-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white shadow-xs">
                {unrememberedCount > 99 ? '99+' : unrememberedCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">未记住</span>
        </button>

        {/* Tab 3: 单词训练 */}
        <button
          onClick={() => onChangeTab('training')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
            activeTab === 'training'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Brain className={`w-5 h-5 transition-transform ${activeTab === 'training' ? 'scale-110' : ''}`} />
            {dueTrainingCount > 0 && (
              <span className="absolute -top-1 -right-2.5 px-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-xs">
                {dueTrainingCount > 99 ? '99+' : dueTrainingCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">单词训练</span>
        </button>
      </div>
    </nav>
  );
};
