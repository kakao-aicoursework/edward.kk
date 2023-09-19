'use client';

import InputArea from '@/components/inputarea';
import ChatArea from '@/components/chatarea';

import { useEffect, useRef, useState } from 'react';
import { Message } from '@/lib/types';

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: '안녕하세요. 챗봇 서비스를 시작합니다. 궁금하신 내용을 물어보세요?',
  },
  // 아래는 메시지 구조 예시입니다.
  // {
  //   role: "user",
  //   content: "{사용자 입력}",
  // },
  // { // 답변 생성 대기 중 상태
  //   role: "assistant",
  //   status: "thinking",
  // },
  // {
  //   role: "assistant",
  //   content: "{답변 내용}",
  // }
];

export default function IndexPage() {
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  const handleSend = async (message: string) => {
    let updatedMessages: Message[] = [
      ...messages,
      {
        role: 'user',
        content: message,
      },
      {
        role: 'assistant',
        status: 'thinking',
      },
    ];

    setMessages(updatedMessages);

    // Streaming, Multi turn 채팅
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: updatedMessages.slice(0, -1),
      }),
    });

    const data = response.body;
    const reader = data?.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let lastMessage = '';
    while (!done && reader) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      lastMessage = lastMessage + chunkValue;

      setMessages([
        ...updatedMessages.slice(0, -1),
        {
          role: 'assistant',
          content: lastMessage,
        },
      ]);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className='absolute inset-0 top-16'>
      <div className='mx-auto flex flex-col w-full h-full md:w-1/2 '>
        <div ref={chatAreaRef} className='flex-1 overflow-auto px-2 pt-10 space-y-4'>
          <ChatArea messages={messages} scrollToBottom={scrollToBottom} />
        </div>
        <div className='pb-20 px-2 pt-4'>
          <InputArea handleSend={handleSend} scrollToBottom={scrollToBottom} />
        </div>
      </div>
    </div>
  );
}
