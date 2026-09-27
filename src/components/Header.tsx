import React from 'react';
import { Image, Smartphone, Monitor, Database, RotateCcw } from 'lucide-react';
import { WordItem } from '../types/word';

interface HeaderProps {
  words: WordItem[];
  onOpenWallpaper: () => void;
  onOpenDataBackup: () => void;
  onResetData: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  isDarkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  words,
  onOpenWallpaper,
  onOpenDataBackup,
  onResetData,
  isMobileFrame,
  onToggleMobileFrame,
  isDarkMode,
}) => {
  const totalCount = words.length;
  const unrememberedCount = words.filter(w => w.isUnremembered && !w.isMastered).length;
  const masteredCount = words.filter(w => w.isMastered).length;

  return (
    <header className={`w-full px-4 pt-3 pb-2.5 transition-colors ${
      isDarkMode ? 'text-zinc-100' : 'text-zinc-800'
    }`}>
      <div className="flex items-center justify-between">
        {/* App Title & Tag */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md font-bold text-base tracking-tighter">
            HR
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight leading-tight flex items-center gap-1.5">
              <span>忆词</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                HighRemember
              </span>
            </h1>
            <p className="text-[11px] opacity-60 leading-none mt-0.5">
              艾宾浩斯智能间隔记忆
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1.5">
          {/* Wallpaper Settings Button */}
          <button
            onClick={onOpenWallpaper}
            title="自定义背景壁纸"
            className="p-2 rounded-xl backdrop-blur-md bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/20 text-zinc-700 dark:text-zinc-200 transition-all active:scale-95 shadow-xs"
          >
            <Image className="w-4 h-4" />
          </button>

          {/* Desktop/Mobile Frame Toggle */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? "切换全屏视图" : "切换手机框视图"}
            className="hidden sm:flex p-2 rounded-xl backdrop-blur-md bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/20 text-zinc-700 dark:text-zinc-200 transition-all active:scale-95 shadow-xs"
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Data Backup & Import */}
          <button
            onClick={onOpenDataBackup}
            title="数据备份与导入恢复"
            className="p-2 rounded-xl backdrop-blur-md bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/20 text-indigo-600 dark:text-indigo-400 transition-all active:scale-95 shadow-xs"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            title="重置示例词库"
            className="p-2 rounded-xl backdrop-blur-md bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/20 text-zinc-700 dark:text-zinc-200 transition-all active:scale-95 shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini Stats Pill Bar */}
      <div className="flex items-center gap-2 mt-2.5 overflow-x-auto text-[11px] pb-1 no-scrollbar">
        <div className="px-2.5 py-1 rounded-full backdrop-blur-md bg-white/40 dark:bg-white/10 border border-white/20 flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span>总存入: <b>{totalCount}</b></span>
        </div>
        <div className="px-2.5 py-1 rounded-full backdrop-blur-md bg-white/40 dark:bg-white/10 border border-white/20 flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>未记住: <b>{unrememberedCount}</b></span>
        </div>
        <div className="px-2.5 py-1 rounded-full backdrop-blur-md bg-white/40 dark:bg-white/10 border border-white/20 flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>已熟记: <b>{masteredCount}</b></span>
        </div>
      </div>
    </header>
  );
};
