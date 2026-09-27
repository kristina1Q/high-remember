import React, { useRef, useState } from 'react';
import { X, Upload, Sliders, Moon, Sun, Check, RefreshCw, Crop, Smartphone, Sparkles } from 'lucide-react';
import { WallpaperConfig } from '../types/word';
import { WALLPAPER_PRESETS } from '../data/wallpapers';
import { ImageCropperModal } from './ImageCropperModal';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WallpaperConfig;
  onChangeConfig: (newConfig: WallpaperConfig) => void;
  onReplaySplash?: () => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onReplaySplash,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [pendingCropImage, setPendingCropImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请上传图片格式文件 (JPG, PNG, WebP 等)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('图片大小请控制在 15MB 以内');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        // 打开框选裁剪窗口，供用户拖动构图
        setPendingCropImage(base64);
        setIsCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);

    // 重置 input 防止重复选择同文件不触发
    e.target.value = '';
  };

  const handleApplyCrop = (croppedDataUrl: string, originalDataUrl: string) => {
    onChangeConfig({
      ...config,
      type: 'custom',
      customImageData: croppedDataUrl,
      originalImageData: originalDataUrl,
    });
  };

  const handleReCrop = () => {
    const raw = config.originalImageData || config.customImageData;
    if (raw) {
      setPendingCropImage(raw);
      setIsCropperOpen(true);
    }
  };

  const handleSelectPreset = (presetId: string, isDark?: boolean) => {
    onChangeConfig({
      ...config,
      type: 'preset',
      presetId,
      isDarkMode: isDark !== undefined ? isDark : config.isDarkMode,
    });
  };

  const handleClearCustom = () => {
    onChangeConfig({
      ...config,
      type: 'preset',
      customImageData: null,
      originalImageData: null,
      presetId: 'clean-minimal',
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-5 shadow-2xl border border-white/20 text-zinc-800 dark:text-zinc-100 flex flex-col gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h2 className="text-base font-bold">自定义背景壁纸</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Custom Image Upload & Crop Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                上传个人自定义壁纸
              </label>
              {config.type === 'custom' && config.customImageData && (
                <button
                  type="button"
                  onClick={handleReCrop}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>框选展示范围</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border-2 border-dashed border-indigo-400/40 hover:border-indigo-500/80 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-medium text-xs transition-all active:scale-98"
              >
                <Upload className="w-4 h-4" />
                <span>选择手机相册/图片</span>
              </button>
              {config.type === 'custom' && (
                <button
                  type="button"
                  onClick={handleClearCustom}
                  title="恢复默认壁纸"
                  className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 text-xs transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Custom Wallpaper Thumbnail & Framing Controls */}
            {config.type === 'custom' && config.customImageData && (
              <div className="mt-2.5 p-2.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-14 rounded-xl overflow-hidden shadow-xs border border-white/40 shrink-0 relative bg-zinc-800">
                    <img
                      src={config.customImageData}
                      alt="壁纸预览"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      当前自定义壁纸
                    </span>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      已按 9:16 手机全屏比例适配
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReCrop}
                  className="py-1.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium flex items-center gap-1 shadow-xs transition-all active:scale-95"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>重新框选</span>
                </button>
              </div>
            )}
          </div>

          {/* Preset Wallpapers */}
          <div>
            <label className="text-xs font-semibold block mb-2 text-zinc-600 dark:text-zinc-400">
              极简风格预设壁纸
            </label>
            <div className="grid grid-cols-4 gap-2">
              {WALLPAPER_PRESETS.map((preset) => {
                const isSelected = config.type === 'preset' && config.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id, preset.darkOverlay)}
                    className={`group relative flex flex-col items-center p-1.5 rounded-2xl border transition-all active:scale-95 ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                        : 'border-zinc-200/60 dark:border-zinc-800 hover:border-indigo-300'
                    }`}
                  >
                    <div
                      className="w-full h-10 rounded-xl shadow-inner relative flex items-center justify-center overflow-hidden"
                      style={{ background: preset.value }}
                    >
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] mt-1 text-center font-medium truncate w-full">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fine Tuning Controls */}
          <div className="space-y-3 bg-zinc-100/60 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40">
            {/* Blur Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>背景模糊 (毛玻璃效果)</span>
                <span className="text-indigo-500 font-mono">{config.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={config.blur}
                onChange={(e) => onChangeConfig({ ...config, blur: Number(e.target.value) })}
                className="w-full accent-indigo-500 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Mask Opacity Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>卡片遮罩浓度 (确保文字清晰)</span>
                <span className="text-indigo-500 font-mono">{Math.round(config.overlayOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={config.overlayOpacity}
                onChange={(e) => onChangeConfig({ ...config, overlayOpacity: Number(e.target.value) })}
                className="w-full accent-indigo-500 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Theme Mode Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium">深色文字 / 浅色模式</span>
              <button
                type="button"
                onClick={() => onChangeConfig({ ...config, isDarkMode: !config.isDarkMode })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-700 shadow-xs border border-zinc-200 dark:border-zinc-600 text-xs font-medium active:scale-95 transition-all"
              >
                {config.isDarkMode ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>暗夜模式</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>浅色模式</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Replay Opening Animation Button */}
          {onReplaySplash && (
            <button
              type="button"
              onClick={onReplaySplash}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>重温美学开屏动画</span>
            </button>
          )}

          {/* Done Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md active:scale-98"
          >
            完成设置
          </button>
        </div>
      </div>

      {/* 独立的范围框选裁剪弹窗 */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={pendingCropImage}
        onClose={() => setIsCropperOpen(false)}
        onApplyCrop={handleApplyCrop}
      />
    </>
  );
};
