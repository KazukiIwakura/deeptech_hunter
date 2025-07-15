

import React, { useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { ChatInputForm } from '../components/chat/ChatInputForm';
import { ChatMessageComponent } from '../components/chat/ChatMessage';
import { ChatSuggestions } from '../components/chat/ChatSuggestions';
import { MicroscopeIcon } from '../components/icons/MicroscopeIcon';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

export const ChatPage: React.FC = () => {
  const { chat, handleSendMessage } = useApp();
  const { activeSession: session, isResponding, error } = chat;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if(session) {
      setTimeout(scrollToBottom, 100);
    }
  }, [session?.messages]);

  if (!session) {
    // Or a loading/redirect component
    return null;
  }

  const hasMessages = session.messages.length > 0;
  const latestMessage = hasMessages ? session.messages[session.messages.length - 1] : null;

  return (
    <div className="flex flex-col h-full bg-neutral-100">
      <main className="flex-1 overflow-y-auto">
        <div className={cn('w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8')}>
          {!hasMessages ? (
             <div className="text-center py-12 md:py-20 animate-fade-in">
              <div className="inline-block p-4 bg-white rounded-full shadow-sm border border-neutral-200">
                <MicroscopeIcon className="w-10 h-10 text-primary"/>
              </div>
              <h1 className={cn('text-[28px] leading-snug font-bold text-main flex items-center', "sm:text-[32px] font-bold text-main mt-8 justify-center")}>
                {session.tech.techName}
              </h1>
              <p className={cn('text-base text-main-light/90 leading-relaxed', "text-main-lighter mt-1")}>{session.tech.university}</p>
              <p className={cn('text-base text-main-light/90 leading-relaxed', "mt-8 max-w-xl mx-auto")}>
                AIによる分析は完了しました。さらに深く知りたい点について、自由に質問してください。
                <br/>
                まずは、AIが提案する以下の質問から始めてみましょう。
              </p>
              <div className="mt-8">
                 <ChatSuggestions
                    suggestions={session.suggestions}
                    isLoading={session.suggestionsLoading}
                    onSuggestionClick={handleSendMessage}
                  />
              </div>
            </div>
          ) : (
            <div className="space-y-8 w-full">
              {session.messages.map((msg) => {
                  const isLastMessage = msg.id === latestMessage?.id;
                  return (
                    <ChatMessageComponent 
                        key={msg.id} 
                        message={msg}
                        isStreaming={isResponding && isLastMessage && msg.role === 'model'}
                    />
                  );
              })}
            </div>
          )}
          {error && <div className="text-center text-danger-text bg-danger-light p-4 rounded-lg text-sm leading-normal">{error}</div>}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="sticky bottom-0">
         <div className="bg-gradient-to-t from-neutral-100 via-neutral-100/90 to-transparent h-20 pointer-events-none -mb-4"></div>
         <ChatInputForm onSendMessage={handleSendMessage} isLoading={isResponding} />
      </footer>
    </div>
  );
};