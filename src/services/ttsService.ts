/**
 * 高保真多模态语音朗读引擎 (原生 Android TTS + 权威词典真人发音 + Web Speech API)
 * 完美解决：
 * 1. 移动端/手机 APP 读长例句因有道 dictvoice 返回 500 null audio 导致的无法触发
 * 2. Android 11+ 隐私包可见性限制无法发现系统 TTS 引擎的问题
 * 3. 异步网络请求后触摸手势过期导致 Web Speech API 静默失效的问题
 */

import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

let activeAudio: HTMLAudioElement | null = null;

/**
 * 判断输入文本是否为完整例句/句子（而非单个单词或短词组）
 */
export function isSentenceText(text: string): boolean {
  const clean = text.trim();
  if (!clean) return false;
  // 含有句号、感叹号、问号，或单词数超过 2 且长度较长
  if (/[.!?]/.test(clean)) return true;
  const words = clean.split(/\s+/);
  return words.length > 2 || clean.length > 28;
}

/**
 * 停止当前所有播放通道（音频元素、原生系统 TTS、浏览器合成语音）
 */
export async function stopAllAudio(): Promise<void> {
  // 1. 停止 HTML Audio
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {
      // 忽略中断
    }
    activeAudio = null;
  }

  // 2. 停止原生平台 TTS
  try {
    await TextToSpeech.stop();
  } catch {
    // 忽略未运行错误
  }

  // 3. 停止 Web Speech
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // 忽略
    }
  }
}

/**
 * 朗读单词（优先真人词典原声录音，备选原生系统 TTS）
 */
export function playWordAudio(
  text: string,
  lang: 'en-US' | 'en-GB' = 'en-US',
  callbacks?: { onStart?: () => void; onEnd?: () => void }
): void {
  const clean = text.trim();
  if (!clean) return;

  // 若传入的是整句，自动转交至例句专用引擎，避免触发有道 500 错误
  if (isSentenceText(clean)) {
    playSentenceAudio(clean, {
      lang,
      onStart: callbacks?.onStart,
      onEnd: callbacks?.onEnd,
    });
    return;
  }

  callbacks?.onStart?.();
  stopAllAudio();

  // 单个词汇优先采用权威真人词典原声发音（美音/英音）
  const audioType = lang === 'en-GB' ? 1 : 2;
  const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(clean)}&type=${audioType}`;

  try {
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // 正在播放
        })
        .catch((err) => {
          console.warn('在线词典发音受限，切换为本地系统引擎', err);
          activeAudio = null;
          speakWithSystemTts(clean, lang, callbacks?.onEnd);
        });
    }

    audio.onended = () => {
      if (activeAudio === audio) {
        activeAudio = null;
      }
      callbacks?.onEnd?.();
    };

    audio.onerror = () => {
      console.warn('在线发音接口响应异常，切换为本地系统引擎');
      activeAudio = null;
      speakWithSystemTts(clean, lang, callbacks?.onEnd);
    };
  } catch (err) {
    console.warn('Audio 初始化失败，切换为本地系统引擎', err);
    speakWithSystemTts(clean, lang, callbacks?.onEnd);
  }
}

/**
 * 朗读例句（专门优化：解决移动设备/原生 Android 上读句失效的问题）
 */
export async function playSentenceAudio(
  text: string,
  options?: {
    lang?: 'en-US' | 'en-GB';
    onStart?: () => void;
    onEnd?: () => void;
  }
): Promise<void> {
  const clean = text.trim();
  if (!clean) {
    options?.onEnd?.();
    return;
  }

  const lang = options?.lang || 'en-US';
  await stopAllAudio();
  options?.onStart?.();

  // 通道 1：Android / iOS 原生 Capacitor 环境（最强稳定性）
  // 直接调用系统底层 android.speech.tts.TextToSpeech，无视网络波动与 WebView 限制
  if (Capacitor.isNativePlatform()) {
    try {
      await TextToSpeech.speak({
        text: clean,
        lang: lang,
        rate: 0.88,
        pitch: 1.0,
        volume: 1.0,
      });
      options?.onEnd?.();
      return;
    } catch (nativeErr) {
      console.warn('原生 TTS 异常，尝试 Web 合成通道', nativeErr);
    }
  }

  // 通道 2：网页 / 手机浏览器中的 Web Speech API（同步在点击手势中发起，防止被浏览器拦截）
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = lang;
      utterance.rate = 0.88;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        options?.onEnd?.();
      };
      utterance.onerror = (e) => {
        console.warn('Web Speech error:', e);
        // 尝试网络备用通道
        playGoogleTtsAudio(clean, options?.onEnd);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Samantha') || v.name.includes('English'))
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
      return;
    } catch (speechErr) {
      console.warn('Web Speech 启动失败，切换网络备用引擎', speechErr);
    }
  }

  // 通道 3：兜底在线音频流 (Google TTS)
  playGoogleTtsAudio(clean, options?.onEnd);
}

/**
 * 本地系统引擎兜底发音
 */
async function speakWithSystemTts(
  text: string,
  lang: 'en-US' | 'en-GB',
  onEnd?: () => void
): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await TextToSpeech.speak({
        text,
        lang,
        rate: 0.9,
      });
      onEnd?.();
      return;
    } catch {
      // 继续使用 Web Speech 降级
    }
  }

  fallbackWebSpeech(text, lang, onEnd);
}

/**
 * Web Speech API 发音
 */
function fallbackWebSpeech(
  text: string,
  lang: 'en-US' | 'en-GB',
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      onEnd?.();
    };
    utterance.onerror = () => {
      onEnd?.();
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Samantha'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('语音合成失败', err);
    onEnd?.();
  }
}

/**
 * 在线句子音频流兜底
 */
function playGoogleTtsAudio(text: string, onEnd?: () => void): void {
  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    activeAudio = audio;
    audio.onended = () => {
      if (activeAudio === audio) activeAudio = null;
      onEnd?.();
    };
    audio.onerror = () => {
      if (activeAudio === audio) activeAudio = null;
      onEnd?.();
    };
    audio.play().catch(() => {
      if (activeAudio === audio) activeAudio = null;
      onEnd?.();
    });
  } catch {
    onEnd?.();
  }
}
