
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { SendIcon } from '../icons/SendIcon';
import { Button } from '../common/Button';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface ChatInputFormProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="bg-white/60 backdrop-blur-md p-4 border-t border-neutral-200/80">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="AIに質問を入力... (Shift + Enterで改行)"
          rows={1}
          className={cn('w-full bg-neutral-100 border-2 border-transparent rounded-lg py-4 pl-4 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all disabled:opacity-60 leading-normal', 'text-base text-main placeholder:text-neutral-600 leading-relaxed')}
          disabled={isLoading}
          style={{ maxHeight: '200px' }}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          variant="primary"
          size="small"
          isIconOnly
          className="absolute right-3 top-1/2 -translate-y-1/2"
          aria-label="メッセージを送信"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
