

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
import { Button } from '../components/common/Button';


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
        'w-full flex items-center px-4 py-2 text-sm text-neutral-300 rounded-lg transition-colors',
        'justify-between',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-neutral-800/60 hover:text-white'
      )}
      role="switch"
      aria-checked={isEnabled}
      disabled={disabled}
    >
      <div className="flex items-center overflow-hidden">
        <VialIcon className="w-4 h-4 mr-3 text-neutral-400 flex-shrink-0" />
        <span className={cn('flex-1 text-left whitespace-nowrap', !isOpen && 'sr-only')}>体験モード</span>
      </div>
      <div
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-2',
          isEnabled 
            ? 'bg-success border-success' 
            : 'bg-neutral-600 border-neutral-600'
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            'inline-block h-3 w-3 transform rounded-full bg-white transition-transform flex items-center justify-center',
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          )}
        >
          {isEnabled && (
            <svg className="w-2 h-2 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </div>
    </button>
    {disabled && (
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max p-2 bg-neutral-800 text-white text-xs text-center rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        APIキーが設定されていません。
        <br />
        体験モードをオフにするにはAPIキーが必要です。
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
        if(window.confirm('このチャット履歴を削除しますか？')) {
            handleDeleteSession(id);
        }
    }

  return (
    <aside className={cn(
        'bg-text-primary text-white flex flex-col shadow-md',
        'flex-shrink-0 transition-all duration-300 ease-in-out',
        isOpen ? 'w-64 p-4' : 'w-16 p-2'
      )}>
        <div className="flex-shrink-0 p-2 mb-8">
             <button
                onClick={handleNewChat}
                className={cn(
                    "flex items-center w-full text-left rounded-md p-3 hover:bg-white/10 transition-colors duration-200",
                    !isOpen && "justify-center"
                )}
                aria-label="ホームに戻り、新しい探索を開始"
             >
                <SparklesIcon className="w-8 h-8 text-primary flex-shrink-0" />
                <div className={cn("flex-1 min-w-0 ml-3", !isOpen && "sr-only")}>
                    <h1 className="text-2xl font-bold text-white truncate">
                        DeepTech Hunter
                    </h1>
                </div>
            </button>
        </div>

        <Button 
            onClick={handleNewChat}
            variant="primary"
            size="medium"
            inverted
            fullWidth
            className={cn(!isOpen && "px-0")}
        >
            <PlusIcon className="w-5 h-5 flex-shrink-0" />
            <span className={cn('ml-2', !isOpen && 'sr-only')}>新しい技術を探索</span>
        </Button>

        <div className="flex-1 flex flex-col min-h-0 mt-6">
            <h2 className={cn("flex-shrink-0 font-medium text-white/70 px-4 mb-3", 'text-sm', !isOpen && "text-center")}>
                <span className={!isOpen ? "sr-only" : ""}>チャット履歴</span>
            </h2>
            <div className="flex-1 overflow-y-auto">
                <nav className="flex flex-col space-y-1">
                    {sessions.map(session => (
                        <button
                            key={session.id}
                            onClick={() => handleSelectSession(session.id)}
                            className={cn(
                                'group flex items-center justify-between px-4 py-3 rounded-md transition-colors text-sm font-normal text-left w-full',
                                activeId === session.id 
                                    ? 'bg-primary text-white font-medium' 
                                    : 'text-white/80 hover:bg-white/10 hover:text-white',
                                !isOpen && 'justify-center'
                            )}
                            title={isOpen ? session.title : session.title}
                        >
                            <MessageSquareIcon className="w-4 h-4 flex-shrink-0" />
                            <span className={cn("flex-1 truncate ml-3", !isOpen && 'sr-only')}>{session.title}</span>
                             <Button
                                onClick={(e) => handleDelete(e, session.id)}
                                variant="ghost"
                                size="x-small"
                                isIconOnly
                                inverted
                                className={cn("ml-2 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100", !isOpen && "sr-only")}
                                aria-label={`チャット「${session.title}」を削除`}
                            >
                                <TrashIcon className="w-4 h-4" />
                            </Button>
                        </button>
                    ))}
                </nav>
            </div>
        </div>

        <footer className="flex-shrink-0 border-t border-white/20 pt-4 mt-6 space-y-2">
            <div className={cn('transition-opacity space-y-2', !isOpen && 'opacity-0 h-0 overflow-hidden pointer-events-none')}>
                <DemoModeToggle isEnabled={isDemoMode} onToggle={onToggleDemoData} isOpen={isOpen} disabled={!isApiKeyConfigured} />
                <Button
                    onClick={() => handleOpenHowItWorksModal()}
                    variant="ghost"
                    size="small"
                    fullWidth
                    inverted
                    className="!justify-start px-4"
                >
                    <SettingsIcon className="w-4 h-4 mr-3 text-white/60 flex-shrink-0" />
                    <span className="flex-1 text-left">このAIの仕組み</span>
                </Button>
            </div>
             <Button
                onClick={onToggleSidebar}
                variant="ghost"
                size="small"
                fullWidth
                inverted
                className={cn("!justify-start px-4", !isOpen && "!justify-center")}
                aria-label={isOpen ? "サイドバーを縮小する" : "サイドバーを展開する"}
            >
                {isOpen ? <ChevronLeftIcon className="w-4 h-4 mr-3 text-white/60" /> : <ChevronRightIcon className="w-4 h-4 text-white/60" />}
                <span className={cn("flex-1 text-left", !isOpen && 'sr-only')}>{isOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}</span>
            </Button>
            <p className={cn("text-center text-white/50 pt-2 text-xs", !isOpen && 'sr-only')}>Powered by Google Gemini API</p>
        </footer>
    </aside>
  );
};