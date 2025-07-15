


import React from 'react';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

const parseInlineMarkdown = (line: string): React.ReactNode => {
  const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  
  return parts.filter(part => part).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-main">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className={cn('text-sm text-main-light leading-normal', "bg-neutral-200/60 text-main rounded px-1.5 py-0.5 font-mono")}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className, isStreaming }) => {
  const blocks = content.replace(/^-/gm, '\n-').replace(/^\*/gm, '\n*').split(/\n\s*\n/).filter(block => block.trim() !== '');

  return (
    <div className={cn('text-base text-main-light/90 leading-7', className)}>
      {blocks.map((block, blockIndex) => {
        const lines = block.trim().split('\n');

        const firstLine = lines[0].trim();
        const blockTitleMatch = firstLine.match(/^\s*-\s*\*\*(.*?)\*\*/);

        if (blockTitleMatch) {
            const title = blockTitleMatch[1];
            const restOfFirstLine = firstLine.substring(blockTitleMatch[0].length).trim();
            const restOfContent = [restOfFirstLine, ...lines.slice(1)].filter(l => l.trim()).join('\n');
            
            return (
                <div key={blockIndex} className="mb-4 last:mb-0">
                    <h4 className={cn('text-base leading-snug font-bold text-main', "text-main mb-1.5")}>{title}</h4>
                    <div className="pl-2">
                        <MarkdownRenderer content={restOfContent} />
                    </div>
                </div>
            );
        }

        const isUnorderedList = lines.every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
        if (isUnorderedList) {
          return (
            <ul key={blockIndex} className="list-none space-y-2 my-3">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="flex items-start">
                  <span className="text-primary mr-3 mt-1.5 flex-shrink-0">•</span>
                  <span>{parseInlineMarkdown(line.trim().substring(2))}</span>
                </li>
              ))}
            </ul>
          );
        }
        
        return (
          <p key={blockIndex} className="mb-4 last:mb-0">
            {lines.map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                    {parseInlineMarkdown(line)}
                    {lineIndex < lines.length - 1 && <br />}
                </React.Fragment>
            ))}
          </p>
        );
      })}
      {isStreaming && <span className="inline-block w-0.5 h-4 bg-main-light animate-pulse ml-1 translate-y-1"></span>}
    </div>
  );
};