


import React from 'react';
import { useApp } from '../contexts/AppContext';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import { KeyIcon } from '../components/icons/KeyIcon';
import { Button } from '../components/common/Button';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface HeaderProps {
    onSearch: (query: string) => void;
}

const BreadcrumbItem: React.FC<{ onClick?: () => void; isCurrent?: boolean; children: React.ReactNode }> = ({ onClick, isCurrent, children }) => {
    const commonClasses = "truncate";
    
    const content = isCurrent
        ? <span className={cn("font-bold text-main", commonClasses)} aria-current="page">{children}</span>
        : onClick
            ? <button onClick={onClick} className={cn("text-main-light hover:text-main hover:underline", commonClasses)}>{children}</button>
            : <span className={cn("text-main-light", commonClasses)}>{children}</span>;
            
    return <li className="flex items-center">{content}</li>;
};

const BreadcrumbSeparator: React.FC = () => (
    <li aria-hidden="true" className="flex items-center">
        <ChevronRightIcon className="w-4 h-4 mx-2 text-neutral-400 flex-shrink-0" />
    </li>
);

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    const {
        appShell,
        search,
        deepDive,
        chat,
        handleNewChat,
        handleBackToResults,
        handleNavigateFromChatToDeepDive,
        handleNavigateFromChatToResults,
    } = useApp();

    const { isApiKeyConfigured, handleOpenHowItWorksModal } = appShell;
    const { searchQuery } = search;
    const { selectedTech } = deepDive;
    const { activeSession } = chat;

    const renderContent = () => {
        if (activeSession) {
            return (
                <nav aria-label="パンくずリスト">
                    <ol className={cn("flex items-center font-normal", 'text-sm text-main-light leading-normal')}>
                        <BreadcrumbItem onClick={handleNewChat}>ホーム</BreadcrumbItem>
                        {searchQuery && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem onClick={handleNavigateFromChatToResults}>「{searchQuery}」の検索結果</BreadcrumbItem>
                            </>
                        )}
                        <BreadcrumbSeparator />
                        <BreadcrumbItem onClick={handleNavigateFromChatToDeepDive}>{activeSession.tech.techName}</BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem isCurrent>チャット</BreadcrumbItem>
                    </ol>
                </nav>
            );
        }
        if (selectedTech) {
            return (
                <nav aria-label="パンくずリスト">
                    <ol className={cn("flex items-center font-normal", 'text-sm text-main-light leading-normal')}>
                        <BreadcrumbItem onClick={handleNewChat}>ホーム</BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem onClick={handleBackToResults}>「{searchQuery}」の検索結果</BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem isCurrent>{selectedTech.techName}</BreadcrumbItem>
                    </ol>
                </nav>
            );
        }
        if (searchQuery) {
            return (
                <nav aria-label="パンくずリスト">
                    <ol className={cn("flex items-center font-normal", 'text-sm text-main-light leading-normal')}>
                        <BreadcrumbItem onClick={handleNewChat}>ホーム</BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem isCurrent>「{searchQuery}」の検索結果</BreadcrumbItem>
                    </ol>
                </nav>
            );
        }
        // Home page doesn't need a title in the header as it's prominent in the content
        return <div className="h-6" />;
    };

    return (
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-neutral-200/80">
            <div className="w-full max-w-full mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between min-h-[5rem] py-4">
                <div className="flex-1 min-w-0 flex items-center">
                    {renderContent()}
                </div>
                
                <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4 ml-4">
                    <Button
                        onClick={() => handleOpenHowItWorksModal('api_key')}
                        variant={isApiKeyConfigured ? 'success' : 'danger'}
                        size="small"
                        aria-label={isApiKeyConfigured ? "APIキー接続状況の確認・変更" : "APIキー接続を設定する"}
                    >
                        <KeyIcon className="w-4 h-4 mr-2" />
                        {isApiKeyConfigured ? 'APIキー接続中' : 'APIキー未接続'}
                    </Button>
                </div>
            </div>
        </header>
    );
};