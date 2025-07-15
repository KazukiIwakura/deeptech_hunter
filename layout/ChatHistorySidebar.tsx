

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
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          isEnabled ? 'bg-success' : 'bg-neutral-600'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
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
        'bg-neutral-900 text-neutral-200 flex flex-col',
        'flex-shrink-0 transition-all duration-300 ease-in-out',
        isOpen ? 'w-72 p-4' : 'w-20 p-2'
      )}>
        <div className="flex-shrink-0 p-2 mb-8">
             <button
                onClick={handleNewChat}
                className={cn(
                    "flex items-center w-full text-left rounded-lg p-2 hover:bg-neutral-800 transition-colors duration-200",
                    !isOpen && "justify-center"
                )}
                aria-label="ホームに戻り、新しい探索を開始"
             >
                <SparklesIcon className="w-8 h-8 text-primary flex-shrink-0" />
                <div className={cn("flex-1 min-w-0 ml-2", !isOpen && "sr-only")}>
                    <h1 className={cn('text-[28px] leading-snug font-bold text-main flex items-center', "text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-400 truncate")}>
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
            <h2 className={cn("flex-shrink-0 font-bold tracking-wider text-neutral-500 uppercase px-4 mb-2", 'text-sm text-main-light leading-normal', !isOpen && "text-center")}>
                <span className={!isOpen ? "sr-only" : ""}>チャット履歴</span>
            </h2>
            <div className="flex-1 overflow-y-auto" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 8px)' }}>
                <nav className="flex flex-col space-y-1">
                    {sessions.map(session => (
                        <a
                            key={session.id}
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleSelectSession(session.id); }}
                            className={cn('group flex items-center justify-between px-4 py-2 rounded-lg transition-colors text-sm font-normal', activeId === session.id ? 'bg-primary/20 text-white font-bold' : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white', !isOpen && 'justify-center')}
                            title={isOpen ? session.title : ''}
                        >
                            <MessageSquareIcon className="w-4 h-4 flex-shrink-0 text-neutral-400" />
                            <span className={cn("flex-1 truncate ml-4", !isOpen && 'sr-only')}>{session.title}</span>
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
                        </a>
                    ))}
                </nav>
            </div>
        </div>

        <footer className="flex-shrink-0 border-t border-neutral-700/50 pt-4 mt-6 space-y-1">
            <div className={cn('transition-opacity space-y-1', !isOpen && 'opacity-0 h-0 overflow-hidden pointer-events-none')}>
                <DemoModeToggle isEnabled={isDemoMode} onToggle={onToggleDemoData} isOpen={isOpen} disabled={!isApiKeyConfigured} />
                <Button
                    onClick={() => handleOpenHowItWorksModal()}
                    variant="ghost"
                    size="small"
                    fullWidth
                    inverted
                    className="!justify-start px-4"
                >
                    <SettingsIcon className="w-4 h-4 mr-3 text-neutral-400 flex-shrink-0" />
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
                {isOpen ? <ChevronLeftIcon className="w-4 h-4 mr-3 text-neutral-400" /> : <ChevronRightIcon className="w-4 h-4 text-neutral-400" />}
                <span className={cn("flex-1 text-left", !isOpen && 'sr-only')}>{isOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}</span>
            </Button>
            <p className={cn("text-center text-neutral-600 pt-2", 'text-sm text-main-light leading-normal', !isOpen && 'sr-only')}>Powered by Google Gemini API.</p>
        </footer>
    </aside>
  );
};