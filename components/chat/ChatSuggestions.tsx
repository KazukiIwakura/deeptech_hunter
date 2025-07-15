
import React from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';

interface ChatSuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ suggestions, isLoading, onSuggestionClick }) => {
  if (isLoading) {
    return (
      <div className="animate-fade-in mb-6 mt-4">
        <div className="flex flex-col items-center gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-neutral-200 rounded-lg w-full max-w-md animate-pulse"></div>
            ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="animate-fade-in my-8 text-center">
        <h3 className="text-sm font-semibold text-main-light mb-4 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 mr-2 text-primary" />
            AIからの質問提案
        </h3>
        <div className="flex flex-col items-center gap-4">
            {suggestions.map((q, i) => (
                <button 
                    key={i}
                    onClick={() => onSuggestionClick(q)}
                    className="w-full max-w-md p-4 bg-white border border-neutral-200 rounded-xl text-sm text-main-light text-left hover:bg-neutral-50 hover:border-primary hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary leading-normal"
                >
                    {q}
                </button>
            ))}
        </div>
    </div>
  );
};