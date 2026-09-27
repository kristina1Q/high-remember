import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-zinc-900 text-zinc-100">
          <div className="max-w-xs w-full p-6 rounded-3xl bg-zinc-800/90 backdrop-blur-xl border border-zinc-700 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">遇到小异常，已保护数据</h2>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                你的词库、未记住单词与复习进度安全保存在手机本地。点击下方按钮即可一键重载恢复。
              </p>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新载入界面</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
