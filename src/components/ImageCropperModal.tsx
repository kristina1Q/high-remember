import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { X, Check, ZoomIn, ZoomOut, Move, RotateCcw, Smartphone, Sparkles } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onApplyCrop: (croppedDataUrl: string, originalDataUrl: string) => void;
}

const CROP_CONTAINER_WIDTH = 180;
const CROP_CONTAINER_HEIGHT = 320; // 9:16 标准手机屏幕比例

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onApplyCrop,
}) => {
  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // offset in px relative to center
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 });

  // Touch gesture tracking for pinch-to-zoom and drag
  const gestureRef = useRef<{
    isPinching: boolean;
    isDragging: boolean;
    initialDist: number;
    initialScale: number;
    initialPos: { x: number; y: number };
    startTouch: { x: number; y: number };
    startMid: { x: number; y: number };
  }>({
    isPinching: false,
    isDragging: false,
    initialDist: 0,
    initialScale: 1.0,
    initialPos: { x: 0, y: 0 },
    startTouch: { x: 0, y: 0 },
    startMid: { x: 0, y: 0 },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset transforms when opening a new image
  useEffect(() => {
    if (isOpen) {
      setScale(1.0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  // Handle image load to determine native dimensions
  const handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImgNaturalSize({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  // 【核心修复】：基于原始宽高比，精准计算铺满 9:16 视窗的无畸变基准尺寸（绝不拉伸压扁图片）
  const baseCoverDimensions = useMemo(() => {
    if (imgNaturalSize.width === 0 || imgNaturalSize.height === 0) {
      return { width: CROP_CONTAINER_WIDTH, height: CROP_CONTAINER_HEIGHT };
    }

    const rContainer = CROP_CONTAINER_WIDTH / CROP_CONTAINER_HEIGHT; // 0.5625
    const rImage = imgNaturalSize.width / imgNaturalSize.height;

    if (rImage > rContainer) {
      // 图片横向较宽（横屏照或4:3）：以容器高 320 为基准，宽度等比展开
      const h = CROP_CONTAINER_HEIGHT;
      const w = Math.round(h * rImage);
      return { width: w, height: h };
    } else {
      // 图片纵向较长：以容器宽 180 为基准，高度等比展开
      const w = CROP_CONTAINER_WIDTH;
      const h = Math.round(w / rImage);
      return { width: w, height: h };
    }
  }, [imgNaturalSize]);

  // TOUCH GESTURE HANDLERS (支持单指拖动 + 双指捏合放大缩小)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      gestureRef.current.isDragging = true;
      gestureRef.current.isPinching = false;
      gestureRef.current.startTouch = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    } else if (e.touches.length === 2) {
      gestureRef.current.isPinching = true;
      gestureRef.current.isDragging = false;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      gestureRef.current.initialDist = dist;
      gestureRef.current.initialScale = scale;
      gestureRef.current.initialPos = { ...position };
      gestureRef.current.startMid = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    if (e.touches.length === 2 && gestureRef.current.isPinching) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (gestureRef.current.initialDist > 0) {
        const factor = dist / gestureRef.current.initialDist;
        const newScale = Math.min(Math.max(gestureRef.current.initialScale * factor, 1.0), 4.5);
        setScale(newScale);

        const currentMidX = (t1.clientX + t2.clientX) / 2;
        const currentMidY = (t1.clientY + t2.clientY) / 2;
        const deltaX = currentMidX - gestureRef.current.startMid.x;
        const deltaY = currentMidY - gestureRef.current.startMid.y;
        setPosition({
          x: gestureRef.current.initialPos.x + deltaX,
          y: gestureRef.current.initialPos.y + deltaY,
        });
      }
    } else if (e.touches.length === 1 && gestureRef.current.isDragging) {
      setPosition({
        x: e.touches[0].clientX - gestureRef.current.startTouch.x,
        y: e.touches[0].clientY - gestureRef.current.startTouch.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      gestureRef.current.isDragging = false;
      gestureRef.current.isPinching = false;
    } else if (e.touches.length === 1) {
      gestureRef.current.isPinching = false;
      gestureRef.current.isDragging = true;
      gestureRef.current.startTouch = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  // MOUSE DRAG & WHEEL ZOOM (电脑端测试)
  const isMouseDownRef = useRef(false);
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    gestureRef.current.startTouch = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    setPosition({
      x: e.clientX - gestureRef.current.startTouch.x,
      y: e.clientY - gestureRef.current.startTouch.y,
    });
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale(prev => Math.min(Math.max(prev + delta, 1.0), 4.5));
  };

  // Preset alignments
  const alignTo = (pos: 'top' | 'center' | 'bottom' | 'left' | 'right') => {
    const currentW = baseCoverDimensions.width * scale;
    const currentH = baseCoverDimensions.height * scale;

    const maxShiftX = Math.max(0, (currentW - CROP_CONTAINER_WIDTH) / 2);
    const maxShiftY = Math.max(0, (currentH - CROP_CONTAINER_HEIGHT) / 2);

    if (pos === 'top') setPosition(prev => ({ ...prev, y: maxShiftY }));
    if (pos === 'bottom') setPosition(prev => ({ ...prev, y: -maxShiftY }));
    if (pos === 'center') setPosition({ x: 0, y: 0 });
    if (pos === 'left') setPosition(prev => ({ ...prev, x: maxShiftX }));
    if (pos === 'right') setPosition(prev => ({ ...prev, x: -maxShiftX }));
  };

  // 【核心修复】：以纯数学仿射变换导出 1080x1920 高清裁切图，100% 保持画面几何比例与框选区域
  const handleConfirm = useCallback(() => {
    if (!imgRef.current || !imageSrc) return;

    const img = imgRef.current;
    const outWidth = 1080;
    const outHeight = 1920;

    const canvas = document.createElement('canvas');
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 底层填充深色防露底
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, outWidth, outHeight);

    // 屏幕预览框到高清画面的放大倍数 (1080 / 180 = 6)
    const M = outWidth / CROP_CONTAINER_WIDTH;

    ctx.save();
    // 1. 定位到输出画布中心，并加上用户拖动的位移（乘以放大倍率 M）
    ctx.translate(outWidth / 2 + position.x * M, outHeight / 2 + position.y * M);
    // 2. 应用用户的缩放系数
    ctx.scale(scale, scale);
    // 3. 将图片以中心对齐画出，尺寸严格保持原图比例
    const drawW = baseCoverDimensions.width * M;
    const drawH = baseCoverDimensions.height * M;
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
    onApplyCrop(croppedDataUrl, imageSrc);
    onClose();
  }, [imageSrc, onApplyCrop, onClose, position, scale, baseCoverDimensions]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-700 p-4 text-white shadow-2xl flex flex-col gap-3 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold">框选手机壁纸展示区域</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gesture Tip */}
        <div className="text-[11px] text-zinc-400 flex items-center justify-between px-1">
          <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            支持双指捏合缩放 / 单指拖动构图
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {imgNaturalSize.width} × {imgNaturalSize.height}
          </span>
        </div>

        {/* Interactive Cropping Viewport */}
        <div className="relative w-full h-[320px] bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-800">
          {/* 9:16 Phone Crop Framing Guide Box */}
          <div 
            ref={containerRef}
            className="relative w-[180px] h-[320px] overflow-hidden rounded-2xl shadow-2xl ring-2 ring-indigo-500 border border-white/40 cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Draggable & Scalable Image with strictly preserved natural aspect ratio */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="待框选壁纸"
              onLoad={handleImageLoaded}
              draggable={false}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: `${baseCoverDimensions.width}px`,
                height: `${baseCoverDimensions.height}px`,
                maxWidth: 'none',
                maxHeight: 'none',
                transform: `translate(-50%, -50%) translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
                transformOrigin: 'center center',
                transition: gestureRef.current.isDragging || gestureRef.current.isPinching ? 'none' : 'transform 0.08s ease-out',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />

            {/* Simulated Phone Screen Notch & Grid Guideline */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2">
              <div className="w-12 h-2.5 rounded-full bg-black/60 mx-auto border border-white/20" />
              {/* 3x3 Composition Rule of Thirds Grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-white/30">
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div />
              </div>
              <div className="w-16 h-1 rounded-full bg-white/40 mx-auto" />
            </div>
          </div>
        </div>

        {/* Controls: Zoom & Quick Alignment */}
        <div className="space-y-2 bg-zinc-800/60 p-3 rounded-2xl border border-zinc-700/60">
          {/* Zoom Slider */}
          <div className="flex items-center gap-2.5">
            <ZoomOut className="w-4 h-4 text-zinc-400" />
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="flex-1 accent-indigo-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-zinc-400" />
            <span className="text-[11px] font-mono w-10 text-right text-indigo-400 font-bold">
              {Math.round(scale * 100)}%
            </span>
          </div>

          {/* Quick Align Buttons */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-400">快捷对齐：</span>
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => alignTo('top')}
                className="px-2 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-[10px] text-zinc-200 transition-colors"
              >
                顶端
              </button>
              <button
                type="button"
                onClick={() => alignTo('center')}
                className="px-2 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-[10px] text-zinc-200 transition-colors"
              >
                居中
              </button>
              <button
                type="button"
                onClick={() => alignTo('bottom')}
                className="px-2 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-[10px] text-zinc-200 transition-colors"
              >
                底端
              </button>
              <button
                type="button"
                onClick={() => { setScale(1.0); setPosition({ x: 0, y: 0 }); }}
                title="重置"
                className="p-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>确认框选并应用</span>
          </button>
        </div>
      </div>
    </div>
  );
};
