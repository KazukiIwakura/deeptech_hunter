

import React from 'react';
import type { ChatMessage } from '../../types';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { BrainIcon } from '../icons/BrainIcon';
import { UserIcon } from '../icons/UserIcon';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface ChatMessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

const ThinkingBubble: React.FC = () => (
    <div className="flex items-center space-x-2 p-2">
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
    </div>
);

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, isStreaming }) => {
  const isModel = message.role === 'model';
  const isThinking = isStreaming && message.content.length === 0;

  return (
    <div className={cn('flex items-start gap-4 animate-fade-in', !isModel && 'justify-end')}>
      {isModel && (
        <div className={cn('flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-primary-lighter text-primary border-4 border-neutral-100 shadow-sm', isThinking && 'animate-pulse-glow')}>
          <BrainIcon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      )}
      <div className={isModel ? 'w-full max-w-2xl md:max-w-3xl p-4 md:p-6 rounded-2xl rounded-tl-lg shadow-sm bg-white border border-neutral-200/80' : 'w-full max-w-2xl md:max-w-3xl p-4 md:p-6 rounded-2xl rounded-tr-lg shadow-sm bg-main text-white'}>
        {isModel ? (
          isThinking ? (
            <ThinkingBubble />
          ) : (
            <MarkdownRenderer 
              content={message.content} 
              isStreaming={isStreaming} 
              className="text-base text-main-light/90 leading-7"
            />
          )
        ) : (
          <p className={cn('text-base text-white/90 leading-7', "whitespace-pre-wrap")}>{message.content}</p>
        )}
      </div>
      {!isModel && (
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-neutral-200 text-main-light border-4 border-neutral-100 shadow-sm">
          <UserIcon className="w-5 h-5 md:w-6 md-h-6" />
        </div>
      )}
    </div>
  );
};