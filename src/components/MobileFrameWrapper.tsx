import React, { useState, useEffect } from 'react';
import { WallpaperConfig } from '../types/word';
import { WALLPAPER_PRESETS } from '../data/wallpapers';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  config: WallpaperConfig;
  isMobileFrame: boolean;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  config,
  isMobileFrame,
}) => {
  // 锁定手机屏幕物理高度，防止软键盘弹出时导致视口高度骤缩、背景尺寸异常放大或跳动
  const [fixedScreenHeight, setFixedScreenHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Math.max(window.screen?.height || 0, window.innerHeight || 0, 850);
    }
    return 850;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastWidth = window.innerWidth;

    const handleResizeOrRotate = () => {
      const currentWidth = window.innerWidth;
      // 仅当屏幕宽度发生明显变化（例如手机横竖屏翻转）时，才重新计算背景基准高度
      // 如果仅高度变短（软键盘弹出），坚决不缩小背景尺寸，彻底消除输入法跳动 Bug！
      if (Math.abs(currentWidth - lastWidth) > 60) {
        lastWidth = currentWidth;
        const newH = Math.max(window.screen?.height || 0, window.innerHeight || 0, 850);
        setFixedScreenHeight(newH);
      }
    };

    window.addEventListener('resize', handleResizeOrRotate);
    window.addEventListener('orientationchange', handleResizeOrRotate);
    return () => {
      window.removeEventListener('resize', handleResizeOrRotate);
      window.removeEventListener('orientationchange', handleResizeOrRotate);
    };
  }, []);

  // Determine background style
  let bgStyle: React.CSSProperties = {};
  if (config.type === 'custom' && config.customImageData) {
    bgStyle = {
      backgroundImage: `url(${config.customImageData})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    };
  } else {
    const preset = WALLPAPER_PRESETS.find(p => p.id === config.presetId) || WALLPAPER_PRESETS[0];
    if (preset.type === 'color') {
      bgStyle = { backgroundColor: preset.value };
    } else {
      bgStyle = {
        backgroundImage: preset.value,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      };
    }
  }

  const overlayBg = config.isDarkMode 
    ? `rgba(15, 23, 42, ${config.overlayOpacity})` 
    : `rgba(255, 255, 255, ${config.overlayOpacity})`;

  return (
    <div 
      className={`min-h-screen w-full relative flex items-center justify-center transition-all ${
        config.isDarkMode ? 'dark text-zinc-100' : 'text-zinc-800'
      }`}
    >
      {/* 
        【真机防抖背景层】：
        1. 锁定高度为物理屏幕全屏高 `${fixedScreenHeight}px`，不受软键盘弹出挤压；
        2. 使用 GPU 硬件加速 translate3d(0,0,0)，消除输入法顶起时的闪烁或重新采样；
      */}
      {!isMobileFrame && (
        <>
          <div 
            className="fixed pointer-events-none -z-20 overflow-hidden"
            style={{
              ...bgStyle,
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: `${fixedScreenHeight}px`,
              minHeight: '100vh',
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)',
            }}
          />
          <div 
            className="fixed pointer-events-none -z-10 transition-all"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: `${fixedScreenHeight}px`,
              minHeight: '100vh',
              backdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
              WebkitBackdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
              backgroundColor: overlayBg,
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)',
            }}
          />
        </>
      )}

      {/* 电脑端仿真环境背景（若开启手机壳视图） */}
      {isMobileFrame && (
        <div 
          className="fixed inset-0 w-full h-full pointer-events-none -z-30 bg-zinc-900/60 backdrop-blur-md"
        />
      )}

      {/* 主体容器 */}
      <div className={`relative z-10 w-full transition-all duration-300 ${
        isMobileFrame 
          ? 'max-w-[420px] my-6 rounded-[44px] shadow-2xl border-[10px] border-zinc-900/90 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl overflow-hidden min-h-[820px] max-h-[92vh] flex flex-col ring-1 ring-white/20'
          : 'max-w-md min-h-screen mx-auto'
      }`}>
        {/* 电脑仿真手机框内的独立固定背景 */}
        {isMobileFrame && (
          <>
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden"
              style={bgStyle}
            />
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none -z-10 transition-all"
              style={{
                backdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
                WebkitBackdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
                backgroundColor: overlayBg,
              }}
            />
          </>
        )}

        {/* 顶部手机灵动岛/刘海 */}
        {isMobileFrame && (
          <div className="w-full pt-3 pb-1 px-7 flex items-center justify-between text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 select-none shrink-0 z-20">
            <span>9:41</span>
            <div className="w-20 h-4 rounded-full bg-zinc-900 dark:bg-zinc-700/80 mx-auto shadow-xs" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <div className="w-4 h-2 rounded-xs border border-current p-0.5 flex items-center">
                <div className="w-2 h-full bg-current rounded-2xs" />
              </div>
            </div>
          </div>
        )}

        {/* 滚动内容区 */}
        <div className={`w-full flex flex-col flex-1 ${isMobileFrame ? 'overflow-y-auto no-scrollbar' : 'min-h-screen'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
