import { useEffect, useRef, useState } from 'react';
import { Message } from '@/lib/types';

export default function useMessage({
  apiUrl = '/api/chat',
  initialMessages = [],
}: {
  apiUrl?: string;
  initialMessages?: Message[];
}) {
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return {
    chatAreaRef,
    messages,
    handleSend: async (message: string) => {
      let updatedMessages: Message[] = [
        ...messages,
        {
          role: 'user',
          content: message,
        },
        {
          role: 'assistant',
          status: 'thinking',
          content: '',
        },
      ];

      setMessages(updatedMessages);

      // Streaming, Multi turn 채팅
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.slice(0, -1),
        }),
      });

      const stream = response.body;
      const reader = stream?.getReader();

      let done = false;
      let lastMessage = '';
      while (!done && reader) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = new TextDecoder().decode(value);
        lastMessage = lastMessage + chunkValue;

        setMessages([
          ...updatedMessages.slice(0, -1),
          {
            role: 'assistant',
            content: lastMessage,
          },
        ]);
      }
    },
  };
}
