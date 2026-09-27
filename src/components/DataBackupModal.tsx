import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Database, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  FolderDown,
  Trash2
} from 'lucide-react';
import { WordItem, WallpaperConfig } from '../types/word';
import { 
  saveBackupToLocal,
  listLocalBackups,
  readLocalBackup,
  deleteLocalBackup,
  clearAllLocalBackups,
  LocalBackupInfo,
  copyToClipboard, 
  parseImportedData, 
  mergeImportedWords 
} from '../services/storageService';
import confetti from 'canvas-confetti';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: WordItem[];
  wallpaperConfig: WallpaperConfig;
  onImportWords: (newWords: WordItem[], newWallpaper?: WallpaperConfig) => void;
}

type TabType = 'export' | 'import';
type ImportMode = 'merge' | 'overwrite';

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  words,
  wallpaperConfig,
  onImportWords,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<TabType>('export');
  
  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
    displayPath?: string;
  } | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  // Local backups list
  const [localBackups, setLocalBackups] = useState<LocalBackupInfo[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [selectedBackupName, setSelectedBackupName] = useState<string | null>(null);
  const [refreshFeedback, setRefreshFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Import states
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [parsedResult, setParsedResult] = useState<{ words: WordItem[]; wallpaper?: WallpaperConfig } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick stats
  const totalCount = words.length;
  const masteredCount = words.filter(w => w.isMastered).length;
  const inTrainingCount = words.filter(w => !w.isMastered).length;
  const unrememberedCount = words.filter(w => w.isUnremembered && !w.isMastered).length;

  const jsonString = JSON.stringify({
    app: 'HighRemember',
    appName: '忆词 HighRemember',
    version: '1.2.0',
    exportTime: new Date().toISOString(),
    wordsCount: words.length,
    words,
    wallpaper: wallpaperConfig
  }, null, 2);

  // Load existing backups on open or when switching tabs
  useEffect(() => {
    if (isOpen) {
      loadLocalBackups(false);
    }
  }, [isOpen, activeTab]);

  const loadLocalBackups = async (showFeedback = false) => {
    setIsLoadingBackups(true);
    if (showFeedback) {
      setRefreshFeedback(null);
    }
    try {
      const list = await listLocalBackups();
      setLocalBackups(list);
      if (showFeedback) {
        setRefreshFeedback({
          type: 'success',
          text: list.length > 0 ? `已刷新！检测到 ${list.length} 个本地备份` : '已刷新，当前无本地备份文件'
        });
        setTimeout(() => setRefreshFeedback(null), 3000);
      }
    } catch (err: any) {
      console.warn('获取本地备份失败', err);
      if (showFeedback) {
        setRefreshFeedback({
          type: 'error',
          text: `刷新异常: ${err?.message || '未知错误'}`
        });
        setTimeout(() => setRefreshFeedback(null), 3000);
      }
    } finally {
      // 保持至少 350ms 旋转动画，让用户清晰看到交互反应
      setTimeout(() => {
        setIsLoadingBackups(false);
      }, 350);
    }
  };

  // Handle Export / Save directly to phone local storage
  const handleExportFile = async () => {
    setIsExporting(true);
    setExportFeedback(null);
    try {
      const result = await saveBackupToLocal(words, wallpaperConfig);
      setExportFeedback({
        type: 'success',
        text: result.message,
        displayPath: result.displayPath
      });
      // 刷新本地历史备份列表
      loadLocalBackups(false);
    } catch (err: any) {
      setExportFeedback({
        type: 'error',
        text: err?.message || '保存到手机本地失败，请检查存储权限'
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Delete a specific backup
  const handleDeleteBackup = async (item: LocalBackupInfo) => {
    if (!window.confirm(`确定要彻底删除备份文件吗？\n${item.name}\n删除后将无法恢复。`)) {
      return;
    }
    try {
      await deleteLocalBackup(item.name, item.directory);
      if (selectedBackupName === item.name) {
        setSelectedBackupName(null);
        setImportText('');
        setParsedResult(null);
      }
      setRefreshFeedback({
        type: 'success',
        text: `已成功删除：${item.name}`
      });
      setTimeout(() => setRefreshFeedback(null), 3000);
      await loadLocalBackups(false);
    } catch (err: any) {
      alert(`删除备份失败: ${err?.message || '未知异常'}`);
    }
  };

  // Handle Clear All Backups
  const handleClearAllBackups = async () => {
    if (!window.confirm(`⚠️ 警告：确定要清空全部 ${localBackups.length} 个本地备份文件吗？\n该操作不可撤销！`)) {
      return;
    }
    try {
      await clearAllLocalBackups();
      setSelectedBackupName(null);
      setImportText('');
      setParsedResult(null);
      setRefreshFeedback({
        type: 'success',
        text: '已清空所有本地备份文件'
      });
      setTimeout(() => setRefreshFeedback(null), 3000);
      await loadLocalBackups(false);
    } catch (err: any) {
      alert(`清空失败: ${err?.message || '未知异常'}`);
    }
  };

  // Handle Copy to Clipboard
  const handleCopyJson = async () => {
    const ok = await copyToClipboard(jsonString);
    if (ok) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    } else {
      alert('复制失败，请手动展开下方文本全选复制');
    }
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSelectedBackupName(file.name);
        setImportText(content);
        tryParseData(content);
      }
    };
    reader.onerror = () => {
      setImportError('读取本地文件失败，请重试');
    };
    reader.readAsText(file);
    // 重置 input 允许选择同一文件
    e.target.value = '';
  };

  // Try parse JSON
  const tryParseData = (text: string) => {
    setImportError(null);
    setImportSuccessMsg(null);
    try {
      const res = parseImportedData(text);
      setParsedResult(res);
    } catch (err: any) {
      setParsedResult(null);
      setImportError(err?.message || 'JSON 解析失败');
    }
  };

  // Handle confirm import
  const handleExecuteImport = () => {
    if (!parsedResult || parsedResult.words.length === 0) return;

    if (importMode === 'overwrite') {
      if (!confirm(`⚠️ 注意：完全覆盖将清空当前本地所有 ${words.length} 个单词，并替换为备份中的 ${parsedResult.words.length} 个单词。确定继续吗？`)) {
        return;
      }
      onImportWords(parsedResult.words, parsedResult.wallpaper);
      setImportSuccessMsg(`成功覆盖导入 ${parsedResult.words.length} 个单词！`);
    } else {
      // Merge mode
      const { merged, addedCount, updatedCount } = mergeImportedWords(words, parsedResult.words);
      onImportWords(merged, parsedResult.wallpaper);
      setImportSuccessMsg(`合并完成！新增 ${addedCount} 个单词，更新 ${updatedCount} 个已有单词。`);
    }

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      onClose();
    }, 1800);
  };

  // Compute merge preview stats
  const previewMerge = parsedResult ? mergeImportedWords(words, parsedResult.words) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm max-h-[88vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-5 shadow-2xl border border-white/20 text-zinc-800 dark:text-zinc-100 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                数据管理 (本地备份与导入)
              </h2>
              <span className="text-[10px] text-zinc-400">
                直接保存到手机本地 · 安全无忧
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'export'
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>保存到手机本地</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'import'
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>导入备份数据</span>
          </button>
        </div>

        {/* TAB 1: EXPORT / SAVE */}
        {activeTab === 'export' && (
          <div className="space-y-3.5">
            {/* Stats Card */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-zinc-800/50 border border-indigo-100 dark:border-zinc-800 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">
                当前本地词库总览
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">总存入</span>
                  <span className="text-base font-bold text-zinc-800 dark:text-zinc-100">{totalCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <span className="text-[10px] text-emerald-500 block">复习中</span>
                  <span className="text-base font-bold text-emerald-600">{inTrainingCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <span className="text-[10px] text-indigo-500 block">已熟记</span>
                  <span className="text-base font-bold text-indigo-600">{masteredCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <span className="text-[10px] text-amber-500 block">生词库</span>
                  <span className="text-base font-bold text-amber-600">{unrememberedCount}</span>
                </div>
              </div>
            </div>

            {/* Export Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleExportFile}
                disabled={isExporting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? '正在保存到手机本地...' : '保存备份到手机本地 (Documents)'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyJson}
                className="w-full py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-98 text-zinc-700 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 transition-all"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                    <span className="text-emerald-600 dark:text-emerald-400">已完整复制全部数据到剪贴板！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-500" />
                    <span>一键复制备份文本 (可粘贴到备忘录)</span>
                  </>
                )}
              </button>
            </div>

            {/* Feedback Message */}
            {exportFeedback && (
              <div className={`p-3 rounded-2xl border text-xs space-y-1.5 animate-in fade-in ${
                exportFeedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {exportFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{exportFeedback.type === 'success' ? '备份已成功保存到手机本地！' : '保存失败'}</span>
                </div>
                {exportFeedback.type === 'success' && exportFeedback.displayPath && (
                  <div className="pl-6 space-y-1 text-[11px]">
                    <div className="p-2 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-emerald-500/20 font-mono text-[10px] text-zinc-700 dark:text-zinc-200 break-all select-all">
                      📁 存储位置：{exportFeedback.displayPath}
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[10px] leading-relaxed">
                      💡 打开手机自带的【文件管理】应用，进入【文档 (Documents)】文件夹即可直接看到此文件。
                    </p>
                  </div>
                )}
                {exportFeedback.type === 'error' && (
                  <p className="pl-6 text-[11px]">{exportFeedback.text}</p>
                )}
              </div>
            )}

            {/* Optional Collapsible JSON Preview */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowJsonPreview(!showJsonPreview)}
                className="text-[11px] text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{showJsonPreview ? '收起完整备份文本' : '查看完整备份 JSON 文本'}</span>
              </button>

              {showJsonPreview && (
                <div className="mt-2 relative animate-in fade-in">
                  <textarea
                    readOnly
                    rows={5}
                    value={jsonString}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 text-zinc-300 font-mono text-[10px] leading-relaxed border border-zinc-700 select-all"
                  />
                  <button
                    onClick={handleCopyJson}
                    className="absolute right-2 bottom-3 px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-medium shadow-xs"
                  >
                    复制
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              💡 <b>保存说明</b>：导出的备份包含所有单词的中英释义、例句造句、艾宾浩斯复习天数与训练历史。保存在本地后，可在“导入备份数据”中一键载入恢复。
            </p>
          </div>
        )}

        {/* TAB 2: IMPORT DATA */}
        {activeTab === 'import' && (
          <div className="space-y-3.5">
            {/* Local Backups List (Direct One-Click Restore & Direct Delete) */}
            <div className="space-y-2 p-3 rounded-2xl bg-indigo-50/60 dark:bg-zinc-800/50 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <FolderDown className="w-4 h-4 text-indigo-600" />
                  手机本地已有备份 ({localBackups.length})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadLocalBackups(true)}
                    disabled={isLoadingBackups}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline active:scale-95 transition-transform"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingBackups ? 'animate-spin' : ''}`} />
                    <span>{isLoadingBackups ? '刷新中...' : '刷新'}</span>
                  </button>
                  {localBackups.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllBackups}
                      className="text-[10px] text-rose-500 hover:text-rose-600 hover:underline active:scale-95 flex items-center gap-0.5"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>清空</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Refresh feedback toast */}
              {refreshFeedback && (
                <div className={`p-2 rounded-xl text-[11px] flex items-center gap-1.5 animate-in fade-in ${
                  refreshFeedback.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-800 dark:text-rose-200 border border-rose-500/30'
                }`}>
                  {refreshFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  )}
                  <span>{refreshFeedback.text}</span>
                </div>
              )}

              {localBackups.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {localBackups.map((item) => (
                    <div
                      key={item.name}
                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                        selectedBackupName === item.name
                          ? 'bg-white dark:bg-zinc-800 border-indigo-500 shadow-xs'
                          : 'bg-white/80 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-zinc-400">
                          {item.displayLocation}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={async () => {
                            setSelectedBackupName(item.name);
                            try {
                              const content = await readLocalBackup(item.name, item.directory);
                              setImportText(content);
                              tryParseData(content);
                            } catch (err: any) {
                              setImportError(`读取文件失败: ${err?.message || '未知异常'}`);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-[10px] font-bold shadow-xs transition-transform"
                        >
                          一键载入
                        </button>
                        <button
                          type="button"
                          title="删除此备份"
                          onClick={() => handleDeleteBackup(item)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-400 text-center py-2">
                  当前无本地备份文件，保存新备份后将在此显示
                </p>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json,text/plain"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* File Pick Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-indigo-50/30 dark:bg-zinc-800/30 text-center cursor-pointer transition-colors group"
            >
              <div className="w-7 h-7 mx-auto rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Upload className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                从手机中选择其他 .json 文件
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                支持从手机文件管理器、微信文件中选取
              </p>
            </div>

            {/* Or Paste JSON Text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-semibold text-zinc-500">
                  或者直接粘贴 JSON 备份文本：
                </label>
                {navigator.clipboard && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const clipText = await navigator.clipboard.readText();
                        if (clipText) {
                          setImportText(clipText);
                          tryParseData(clipText);
                        }
                      } catch {
                        alert('请长按下方输入框直接粘贴');
                      }
                    }}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>从剪贴板填入</span>
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value);
                  if (e.target.value.trim()) {
                    tryParseData(e.target.value);
                  } else {
                    setParsedResult(null);
                    setImportError(null);
                  }
                }}
                placeholder="在此长按粘贴复制的备份数据 (形如 {'words': [...]} 或 [...])..."
                className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Import Mode Selector */}
            {parsedResult && (
              <div className="space-y-2 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700 text-xs">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  导入模式选择
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportMode('merge')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      importMode === 'merge'
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>合并导入 (推荐)</span>
                    </div>
                    <p className="text-[9px] font-normal opacity-80 mt-1">
                      保留现有复习进度，补充新单词并优化已有释义
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportMode('overwrite')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      importMode === 'overwrite'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>完全覆盖</span>
                    </div>
                    <p className="text-[9px] font-normal opacity-80 mt-1">
                      清空现有词库，完全以导入的备份为准
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Parsed Preview Card */}
            {parsedResult && previewMerge && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>数据校验通过！检测到 {parsedResult.words.length} 个单词</span>
                </div>
                <div className="text-[11px] opacity-90 pl-5 space-y-0.5">
                  {importMode === 'merge' ? (
                    <p>将新增 <b>{previewMerge.addedCount}</b> 个新词，并更新 <b>{previewMerge.updatedCount}</b> 个已有词汇。</p>
                  ) : (
                    <p>将直接恢复这 <b>{parsedResult.words.length}</b> 个单词作为您的完整词库。</p>
                  )}
                  {parsedResult.wallpaper && (
                    <p className="text-indigo-600 dark:text-indigo-400">包含自定义壁纸配置，导入后将同步恢复。</p>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {importError && (
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{importError}</span>
              </div>
            )}

            {/* Success Message */}
            {importSuccessMsg && (
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in font-bold">
                <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
                <span>{importSuccessMsg}</span>
              </div>
            )}

            {/* Confirm Import Button */}
            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={!parsedResult}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>立即确认导入数据</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
