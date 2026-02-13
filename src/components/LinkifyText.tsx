import React from 'react';

interface LinkifyTextProps {
  text: string;
  className?: string;
}

export function LinkifyText({ text, className = '' }: LinkifyTextProps) {
  if (!text) return null;

  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  
  const parts = text.split(urlPattern);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.match(urlPattern)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
