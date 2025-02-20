// components/chat-message.tsx
import { cn } from '@/lib/utils';
import React from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  message: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  message,
}) => {
  return (
    <div
      className={cn(
        'flex w-full p-4',
        role === 'assistant'
          ? 'bg-gray-100 justify-start'
          : 'justify-end'
      )}
    >
      <div className="rounded-lg bg-white p-4">
        {
            role === 'assistant' ? (
                <div dangerouslySetInnerHTML={{ __html: message }} />
            ) : (
                message
            )
        }
      </div>
    </div>
  );
};
