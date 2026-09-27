import React, { useState, useEffect, useRef } from 'react';
import splashImg from '../assets/splash.png';
import { Sparkles, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  isMobileFrame?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  isMobileFrame = false,
}) => {
  // 图片就绪状态（防止图片未解码时黑场提前消失导致闪烁）
  const [isImgReady, setIsImgReady] = useState(false);

  // 动画阶段状态控制
  // 1. 黑场过渡：0~750ms 保持纯黑静谧，750ms 后随时间消退 (历时 1200ms)
  const [blackOpacity, setBlackOpacity] = useState(1);
  // 2. 标语与界面文字渐显
  const [contentOpacity, setContentOpacity] = useState(0);
  // 3. 黑到白过渡：3000ms 触发纯净白场光芒 (历时 750ms)
  const [whiteOpacity, setWhiteOpacity] = useState(0);
  // 4. 整体淡出进入应用主界面：3750ms 触发
  const [isExiting, setIsExiting] = useState(false);
  // 倒计时剩余秒数 (4s 满时长)
  const [countdown, setCountdown] = useState(4);

  const isSkippedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };

  const handleSkip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isSkippedRef.current) return;
    isSkippedRef.current = true;

    // 清理所有未触发的定时器
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // 立即以柔和亮白光幕快速无缝融入主界面
    setWhiteOpacity(1);
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onFinish();
      }, 300);
    }, 180);
  };

  useEffect(() => {
    // 倒计时推进 (4s -> 3s -> 2s -> 1s)
    addTimer(() => setCountdown(3), 1000);
    addTimer(() => setCountdown(2), 2000);
    addTimer(() => setCountdown(1), 3000);

    // 【阶段 1：黑场破晓】
    // 0 ~ 250ms 保持纯黑静谧，紧接着平缓淡出，原画快速浮现 (历时 1000ms)
    addTimer(() => {
      setBlackOpacity(0);
      setContentOpacity(1);
    }, 250);

    // 【阶段 2：黑到白过渡】
    // 3000ms 时，纯白光芒从背景破晓弥漫，形成完美的“黑到白过渡” (历时 750ms)
    addTimer(() => {
      setWhiteOpacity(1);
    }, 3000);

    // 【阶段 3：淡入应用】
    // 3750ms 时，白场消散融入 App 洁净主界面
    addTimer(() => {
      setIsExiting(true);
    }, 3750);

    // 【阶段 4：动画完成并销毁】
    // 4200ms 时，开屏组件彻底完成并卸载
    addTimer(() => {
      onFinish();
    }, 4200);

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [onFinish]);

  return (
    <div
      onClick={() => handleSkip()}
      className={`${
        isMobileFrame 
          ? 'absolute inset-0 rounded-[34px] overflow-hidden' 
          : 'fixed inset-0'
      } z-50 bg-black flex flex-col justify-between select-none cursor-pointer transition-opacity duration-500 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {/* 
        【底层 (z-0)：核心超清原画】
        采用 4.6s 悠缓推进的 Ken Burns 电影推镜，优雅展现礼服少女与宫殿阶梯
      */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <img
          src={splashImg}
          alt="Opening Splash"
          onLoad={() => setIsImgReady(true)}
          className={`w-full h-full object-cover object-[center_28%] transition-opacity duration-500 ${
            isImgReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            animation: isImgReady ? 'splash-kenburns 4.6s cubic-bezier(0.25, 1, 0.5, 1) forwards' : 'none',
            willChange: 'transform',
          }}
        />
      </div>

      {/* 
        【装饰层 (z-10)：氛围微光与光点】
      */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 顶部与底部暗角遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />

        {/* 吊灯光晕微光脉动 */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(254, 240, 138, 0.32) 0%, rgba(217, 119, 6, 0.08) 50%, transparent 75%)',
            animation: 'splash-glow 3.5s ease-in-out infinite',
            filter: 'blur(32px)',
          }}
        />

        {/* 向上飘扬的金色光斑粒子 */}
        {[
          { left: '18%', bottom: '22%', delay: '0.2s', size: 'w-1.5 h-1.5' },
          { left: '42%', bottom: '32%', delay: '0.6s', size: 'w-2 h-2' },
          { left: '68%', bottom: '24%', delay: '0.9s', size: 'w-1.5 h-1.5' },
          { left: '82%', bottom: '38%', delay: '0.4s', size: 'w-1 h-1' },
          { left: '30%', bottom: '46%', delay: '1.2s', size: 'w-2 h-2' },
          { left: '56%', bottom: '28%', delay: '0.8s', size: 'w-1.5 h-1.5' },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute ${p.size} rounded-full bg-amber-200 shadow-[0_0_8px_#fef08a]`}
            style={{
              left: p.left,
              bottom: p.bottom,
              animation: `splash-particle 2.8s ease-out infinite ${p.delay}`,
            }}
          />
        ))}
      </div>

      {/* 
        【核心过渡层 1：黑场过渡幕布 (z-20)】
        1. 位于原画之上、文字与跳过按钮之下；
        2. 0~750ms 严格保持全黑；750ms 起，以 1200ms 的舒缓平滑速度淡出至透明；
        3. 即使图片在极端慢速设备上加载，也绝不会穿帮闪烁白屏！
      */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-20"
        style={{
          opacity: isImgReady ? blackOpacity : 1,
          transition: 'opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* 
        【界面交互层 (z-30)：顶部状态栏与跳过按钮】
      */}
      <header className="relative z-30 flex items-center justify-between p-5 pt-8">
        <div 
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] text-amber-200/90 font-medium tracking-wider"
          style={{ 
            opacity: contentOpacity,
            transition: 'opacity 1000ms ease-out',
          }}
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>忆词</span>
        </div>

        {/* 跳过按钮 */}
        <button
          type="button"
          onClick={handleSkip}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/50 hover:bg-black/70 active:scale-95 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wide transition-all shadow-lg"
        >
          <span>跳过</span>
          <span className="text-[10px] text-amber-300 font-mono">({countdown}s)</span>
          <ChevronRight className="w-3 h-3 text-zinc-300" />
        </button>
      </header>

      {/* 
        【品牌标题层 (z-30)：底部标语】
      */}
      <footer 
        className="relative z-30 p-6 pb-10 text-center flex flex-col items-center gap-2"
        style={{
          opacity: contentOpacity,
          transform: contentOpacity ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 1100ms ease-out, transform 1100ms ease-out',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-300/60" />
          <h1 className="text-xl sm:text-2xl font-black tracking-[0.28em] uppercase bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-300 bg-clip-text text-transparent drop-shadow-md">
            HIGH REMEMBER
          </h1>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-300/60" />
        </div>

        <p className="text-xs font-light text-zinc-300/90 tracking-[0.2em] font-serif">
          心之所向 · 历历在目 · 艾宾浩斯智能记忆
        </p>

        <div className="flex items-center gap-1 mt-2 text-[10px] text-zinc-400/70 tracking-widest font-mono">
          <span>TAP ANYWHERE TO ENTER</span>
        </div>
      </footer>

      {/* 
        【核心过渡层 2：黑到白过渡 (z-40)】
        3000ms 时纯白光芒温润充盈全屏，历时 750ms 完成“黑到白”蜕变
      */}
      <div
        className="absolute inset-0 bg-white pointer-events-none z-40"
        style={{
          opacity: whiteOpacity,
          transition: 'opacity 750ms ease-in-out',
        }}
      />
    </div>
  );
};
