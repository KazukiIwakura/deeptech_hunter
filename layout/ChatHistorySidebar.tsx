

import React from 'react';
import { useApp } from '../contexts/AppContext';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { MessageSquareIcon } from '../components/icons/MessageSquareIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import { VialIcon } from '../components/icons/VialIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';


const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

const DemoModeToggle: React.FC<{
  isEnabled: boolean;
  onToggle: () => void;
  isOpen: boolean;
  disabled: boolean;
}> = ({ isEnabled, onToggle, isOpen, disabled }) => (
  <div className="relative group">
    <button
      onClick={onToggle}
      className={cn(
        'w-full flex items-center px-3 py-2.5 text-sm text-white/80 rounded-lg transition-all duration-200',
        'justify-between focus:outline-none focus:ring-2 focus:ring-primary/50',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-white/8 hover:text-white'
      )}
      role="switch"
      aria-checked={isEnabled}
      aria-describedby={disabled ? "demo-mode-tooltip" : undefined}
      aria-label={`体験モード ${isEnabled ? 'オン' : 'オフ'}${disabled ? ' - APIキーが必要です' : ''}`}
      disabled={disabled}
    >
      <div className="flex items-center overflow-hidden">
        <VialIcon className="w-4 h-4 mr-3 text-white/60 flex-shrink-0" aria-hidden="true" />
        <span className={cn('flex-1 text-left font-medium', !isOpen && 'sr-only')}>体験モード</span>
      </div>
      <div
        className={cn(
          'relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200 border',
          isEnabled
            ? 'bg-success border-success shadow-sm'
            : 'bg-white/20 border-white/30'
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 shadow-sm',
            isEnabled ? 'translate-x-4' : 'translate-x-0.5'
          )}
        />
      </div>
    </button>
    {disabled && (
      <div
        id="demo-mode-tooltip"
        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-48 p-3 bg-neutral-800 text-white text-xs text-center rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none z-10 border border-white/10"
        role="tooltip"
        aria-live="polite"
      >
        APIキーが設定されていません。体験モードをオフにするにはAPIキーが必要です。
      </div>
    )}
  </div>
);

export const ChatHistorySidebar: React.FC = () => {
  const { chat, appShell, handleNewChat, handleSelectSession, handleDeleteSession } = useApp();
  const { sessions, activeId } = chat;
  const {
    useDemoData: isDemoMode,
    isApiKeyConfigured,
    onToggleDemoData,
    isSidebarOpen: isOpen,
    onToggleSidebar,
    handleOpenHowItWorksModal
  } = appShell;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('このチャット履歴を削除しますか？')) {
      handleDeleteSession(id);
    }
  }

  return (
    <aside className={cn(
      'bg-text-primary text-white flex flex-col shadow-xl border-r border-white/10',
      'flex-shrink-0 transition-all duration-300 ease-in-out',
      isOpen ? 'w-64' : 'w-16'
    )}>
      {/* Header Section */}
      <header className="flex-shrink-0 p-3 border-b border-white/10">
        <button
          onClick={handleNewChat}
          className={cn(
            "flex items-center w-full text-left rounded-lg p-3 hover:bg-white/8 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/8",
            !isOpen && "justify-center p-2"
          )}
          aria-label="ホームに戻り、新しい探索を開始"
        >
          <SparklesIcon className="w-6 h-6 text-primary flex-shrink-0" aria-hidden="true" />
          <div className={cn("flex-1 min-w-0 ml-3", !isOpen && "sr-only")}>
            <h1 className="text-base font-semibold text-white truncate leading-tight">
              DeepTech Hunter
            </h1>
            <p className="text-xs text-white/60 mt-0.5">AI Research Platform</p>
          </div>
        </button>
      </header>

      {/* New Chat Button */}
      <div className="p-3 border-b border-white/10">
        <button
          onClick={handleNewChat}
          className={cn(
            "w-full flex items-center justify-center px-3 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200 font-medium text-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-neutral-900",
            "shadow-sm hover:shadow-md",
            !isOpen && "px-2"
          )}
        >
          <PlusIcon className="w-4 h-4 flex-shrink-0" />
          <span className={cn('ml-2', !isOpen && 'sr-only')}>新しい探索</span>
        </button>
      </div>

      {/* Chat History Section */}
      <main className="flex-1 flex flex-col min-h-0 p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className={cn("font-medium text-white/70 text-xs uppercase tracking-wider", !isOpen && "sr-only")}>
            チャット履歴
          </h2>
          {sessions.length > 0 && (
            <span className={cn("text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full", !isOpen && "sr-only")}>
              {sessions.length}
            </span>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto -mx-1" role="region" aria-label="チャット履歴一覧">
          <nav className="flex flex-col space-y-1 px-1" aria-label="チャットセッション">
            {sessions.length === 0 ? (
              <div className={cn("text-center py-8", !isOpen && "sr-only")}>
                <MessageSquareIcon className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-white/50 text-xs">
                  まだチャット履歴がありません
                </p>
              </div>
            ) : (
              sessions.map(session => (
                <div key={session.id} className="relative group">
                  <button
                    onClick={() => handleSelectSession(session.id)}
                    className={cn(
                      'w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-normal text-left',
                      'focus:outline-none focus:ring-2 focus:ring-primary/50',
                      activeId === session.id
                        ? 'bg-primary/20 text-white font-medium border border-primary/30 shadow-sm'
                        : 'text-white/80 hover:bg-white/8 hover:text-white',
                      !isOpen && 'justify-center px-2'
                    )}
                    title={session.title}
                    aria-current={activeId === session.id ? "page" : undefined}
                    aria-label={`チャット: ${session.title}${activeId === session.id ? ' (現在選択中)' : ''}`}
                  >
                    <MessageSquareIcon className={cn("w-4 h-4 flex-shrink-0", activeId === session.id ? "text-primary" : "text-white/60")} aria-hidden="true" />
                    <span className={cn("flex-1 truncate ml-3", !isOpen && 'sr-only')}>{session.title}</span>
                    {activeId === session.id && (
                      <div className={cn("w-2 h-2 bg-primary rounded-full flex-shrink-0", !isOpen && "sr-only")} />
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => handleDelete(e, session.id)}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md",
                      "opacity-0 group-hover:opacity-100 transition-all duration-200",
                      "hover:bg-red-500/20 hover:text-red-400 text-white/40",
                      "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500/50",
                      !isOpen && "sr-only"
                    )}
                    aria-label={`チャット「${session.title}」を削除`}
                  >
                    <TrashIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))
            )}
          </nav>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="flex-shrink-0 border-t border-white/10 p-3 space-y-2" role="contentinfo">
        <div className={cn('transition-all duration-300 space-y-2', !isOpen && 'opacity-0 h-0 overflow-hidden pointer-events-none')} aria-hidden={!isOpen}>
          <DemoModeToggle isEnabled={isDemoMode} onToggle={onToggleDemoData} isOpen={isOpen} disabled={!isApiKeyConfigured} />
          
          <button
            onClick={() => handleOpenHowItWorksModal()}
            className="w-full flex items-center px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-describedby="how-it-works-description"
          >
            <SettingsIcon className="w-4 h-4 mr-3 text-white/60 flex-shrink-0" aria-hidden="true" />
            <span className="flex-1 text-left font-medium">このAIの仕組み</span>
          </button>
          <span id="how-it-works-description" className="sr-only">
            AIの動作原理と機能について詳しく説明するモーダルを開きます
          </span>
        </div>
        
        <button
          onClick={onToggleSidebar}
          className={cn(
            "w-full flex items-center px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
            !isOpen && "justify-center px-2"
          )}
          aria-label={isOpen ? "サイドバーを縮小する" : "サイドバーを展開する"}
          aria-expanded={isOpen}
          aria-controls="sidebar-content"
        >
          {isOpen ? (
            <>
              <ChevronLeftIcon className="w-4 h-4 mr-3 text-white/60" aria-hidden="true" />
              <span className="flex-1 text-left font-medium">サイドバーを閉じる</span>
            </>
          ) : (
            <ChevronRightIcon className="w-4 h-4 text-white/60" aria-hidden="true" />
          )}
        </button>
        
        <div className={cn("text-center pt-2 border-t border-white/10", !isOpen && 'sr-only')}>
          <p className="text-white/50 text-xs font-medium" role="note">
            Powered by Google Gemini API
          </p>
        </div>
      </footer>
    </aside>
  );
};