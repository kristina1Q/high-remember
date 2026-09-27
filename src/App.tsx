import React, { useState, useEffect } from 'react';
import { WordItem, ActiveTab, WallpaperConfig } from './types/word';
import { loadWords, saveWords, loadWallpaperConfig, saveWallpaperConfig } from './services/storageService';
import { INITIAL_WORDS } from './data/initialWords';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WallpaperModal } from './components/WallpaperModal';
import { WordDetailModal } from './components/WordDetailModal';
import { FocusedPracticeModal } from './components/FocusedPracticeModal';
import { DataBackupModal } from './components/DataBackupModal';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { WordVaultTab } from './components/tabs/WordVaultTab';
import { UnrememberedTab } from './components/tabs/UnrememberedTab';
import { TrainingTab } from './components/tabs/TrainingTab';
import { SplashScreen } from './components/SplashScreen';

export function App() {
  const [words, setWords] = useState<WordItem[]>(() => loadWords());
  const [wallpaperConfig, setWallpaperConfig] = useState<WallpaperConfig>(() => loadWallpaperConfig());
  const [activeTab, setActiveTab] = useState<ActiveTab>('vault');
  const [showSplash, setShowSplash] = useState(true);

  // Modals state
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [isDataBackupModalOpen, setIsDataBackupModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [isFocusedPracticeOpen, setIsFocusedPracticeOpen] = useState(false);
  const [focusedWordsList, setFocusedWordsList] = useState<WordItem[]>([]);

  // Desktop simulator frame state (defaults to true if on desktop/tablet)
  const [isMobileFrame, setIsMobileFrame] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });

  // Sync words to localStorage whenever updated
  useEffect(() => {
    saveWords(words);
  }, [words]);

  // Sync wallpaper settings to localStorage
  useEffect(() => {
    saveWallpaperConfig(wallpaperConfig);
  }, [wallpaperConfig]);

  // Add new word
  const handleAddWord = (
    wordData: Omit<WordItem, 'id' | 'createdAt' | 'reviewStage' | 'scheduledDay' | 'isMastered' | 'isUnremembered' | 'unrememberedCount' | 'trainingHistory'>
  ) => {
    const newWord: WordItem = {
      ...wordData,
      id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
      reviewStage: 0,
      scheduledDay: 2, // 存入后排入第2天训练
      isMastered: false,
      isUnremembered: false,
      unrememberedCount: 0,
      trainingHistory: [],
    };

    setWords(prev => [newWord, ...prev]);
  };

  // Training Action: "记住"
  const handleRemembered = (wordId: string) => {
    setWords(prev => prev.map(w => {
      if (w.id !== wordId) return w;

      // 推进艾宾浩斯间隔：第2天 -> 第4天 -> 第7天 -> 第15天 -> 熟记完成
      let nextDay = w.scheduledDay;
      let nextStage = w.reviewStage + 1;
      let isMastered = false;

      if (w.scheduledDay === 2) {
        nextDay = 4;
      } else if (w.scheduledDay === 4) {
        nextDay = 7;
      } else if (w.scheduledDay === 7) {
        nextDay = 15;
      } else if (w.scheduledDay === 15) {
        isMastered = true; // 第15天复习后顺利完成记忆周期
      }

      return {
        ...w,
        scheduledDay: nextDay,
        reviewStage: nextStage,
        isMastered,
        isUnremembered: false,
        lastTrainedAt: Date.now(),
        trainingHistory: [
          ...w.trainingHistory,
          { date: Date.now(), interval: w.scheduledDay, result: 'remembered' as const }
        ]
      };
    }));
  };

  // Training Action: "熟记" (熟记则不用在后面的训练中出现)
  const handleMastered = (wordId: string) => {
    setWords(prev => prev.map(w => {
      if (w.id !== wordId) return w;
      return {
        ...w,
        isMastered: true,
        isUnremembered: false,
        lastTrainedAt: Date.now(),
        trainingHistory: [
          ...w.trainingHistory,
          { date: Date.now(), interval: w.scheduledDay, result: 'mastered' as const }
        ]
      };
    }));
  };

  // Training Action: "未记住" (未记住则放入未记住的单词板块)
  const handleUnremembered = (wordId: string) => {
    setWords(prev => prev.map(w => {
      if (w.id !== wordId) return w;
      return {
        ...w,
        isUnremembered: true,
        unrememberedCount: (w.unrememberedCount || 0) + 1,
        lastTrainedAt: Date.now(),
        trainingHistory: [
          ...w.trainingHistory,
          { date: Date.now(), interval: w.scheduledDay, result: 'unremembered' as const }
        ]
      };
    }));
  };

  // Remove word from unremembered tab (conquered)
  const handleRemoveUnremembered = (wordId: string) => {
    setWords(prev => prev.map(w => {
      if (w.id !== wordId) return w;
      return {
        ...w,
        isUnremembered: false,
      };
    }));
  };

  // Re-enter unremembered word into training schedule
  const handleRequeueTraining = (wordId: string) => {
    setWords(prev => prev.map(w => {
      if (w.id !== wordId) return w;
      return {
        ...w,
        scheduledDay: 2,
        reviewStage: 0,
        isUnremembered: false,
        isMastered: false,
      };
    }));
  };

  const handleDeleteWord = (wordId: string) => {
    setWords(prev => prev.filter(w => w.id !== wordId));
  };

  // Update edited word in vault
  const handleUpdateWord = (updated: WordItem) => {
    setWords(prev => prev.map(w => w.id === updated.id ? updated : w));
    setSelectedWord(updated);
  };

  // Toggle mastered status from detail modal
  const handleToggleMastered = (wordId: string) => {
    setWords(prev => prev.map(w => {
      if (w.id !== wordId) return w;
      return { ...w, isMastered: !w.isMastered };
    }));
  };

  // Toggle unremembered status from detail modal
  const handleToggleUnremembered = (wordId: string) => {
    setWords(prev => prev.map(w => {
      if (w.id !== wordId) return w;
      return { ...w, isUnremembered: !w.isUnremembered };
    }));
  };

  // Reset to initial demo words
  const handleResetData = () => {
    if (confirm('确定要重置回默认的精选体验词库吗？这将包含第2/4/7/15天的示例训练单词。')) {
      setWords(INITIAL_WORDS);
    }
  };

  // Start focused practice for unremembered
  const handleStartFocusedPractice = (list: WordItem[]) => {
    setFocusedWordsList(list);
    setIsFocusedPracticeOpen(true);
  };

  // Handle import words from backup
  const handleImportWords = (newWords: WordItem[], newWallpaper?: WallpaperConfig) => {
    setWords(newWords);
    if (newWallpaper) {
      setWallpaperConfig(newWallpaper);
    }
  };

  // Replay splash screen
  const handleReplaySplash = () => {
    setIsWallpaperModalOpen(false);
    setShowSplash(true);
  };

  // Count unremembered words
  const unrememberedCount = words.filter(w => w.isUnremembered && !w.isMastered).length;
  // Count words pending training
  const dueTrainingCount = words.filter(w => !w.isMastered).length;

  return (
    <MobileFrameWrapper
      config={wallpaperConfig}
      isMobileFrame={isMobileFrame}
    >
      {/* Opening Splash Screen */}
      {showSplash && (
        <SplashScreen
          onFinish={() => setShowSplash(false)}
          isMobileFrame={isMobileFrame}
        />
      )}

      {/* Top Header */}
      <Header
        words={words}
        onOpenWallpaper={() => setIsWallpaperModalOpen(true)}
        onOpenDataBackup={() => setIsDataBackupModalOpen(true)}
        onResetData={handleResetData}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        isDarkMode={wallpaperConfig.isDarkMode}
      />

      {/* Main Content Body */}
      <main className="flex-1 px-4 pt-1">
        {activeTab === 'vault' && (
          <WordVaultTab
            words={words}
            onAddWord={handleAddWord}
            onSelectWord={(w) => setSelectedWord(w)}
            isDarkMode={wallpaperConfig.isDarkMode}
          />
        )}

        {activeTab === 'unremembered' && (
          <UnrememberedTab
            words={words}
            onRemoveUnremembered={handleRemoveUnremembered}
            onRequeueTraining={handleRequeueTraining}
            onMarkMastered={handleMastered}
            onSelectWord={(w) => setSelectedWord(w)}
            onStartFocusedPractice={handleStartFocusedPractice}
            isDarkMode={wallpaperConfig.isDarkMode}
          />
        )}

        {activeTab === 'training' && (
          <TrainingTab
            words={words}
            onRemembered={handleRemembered}
            onMastered={handleMastered}
            onUnremembered={handleUnremembered}
            onGoToUnrememberedTab={() => setActiveTab('unremembered')}
            isDarkMode={wallpaperConfig.isDarkMode}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        unrememberedCount={unrememberedCount}
        dueTrainingCount={dueTrainingCount}
        isDarkMode={wallpaperConfig.isDarkMode}
      />

      {/* Wallpaper Customization Modal */}
      <WallpaperModal
        isOpen={isWallpaperModalOpen}
        onClose={() => setIsWallpaperModalOpen(false)}
        config={wallpaperConfig}
        onChangeConfig={setWallpaperConfig}
        onReplaySplash={handleReplaySplash}
      />

      {/* Word Detailed Archive Modal */}
      <WordDetailModal
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
        onDeleteWord={handleDeleteWord}
        onToggleMastered={handleToggleMastered}
        onToggleUnremembered={handleToggleUnremembered}
        onUpdateWord={handleUpdateWord}
      />

      {/* Focused Flashcard Drill for Unremembered Words */}
      <FocusedPracticeModal
        isOpen={isFocusedPracticeOpen}
        words={focusedWordsList}
        onClose={() => setIsFocusedPracticeOpen(false)}
        onConquerWord={handleRemoveUnremembered}
      />

      {/* Data Backup & Import Modal */}
      <DataBackupModal
        isOpen={isDataBackupModalOpen}
        onClose={() => setIsDataBackupModalOpen(false)}
        words={words}
        wallpaperConfig={wallpaperConfig}
        onImportWords={handleImportWords}
      />
    </MobileFrameWrapper>
  );
}

export default App;
