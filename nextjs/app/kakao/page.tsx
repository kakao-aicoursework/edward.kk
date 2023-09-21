'use client';

import InputArea from '@/components/inputarea';
import ChatArea from '@/components/chatarea';

import { Message } from '@/lib/types';
import useMessage from '@/lib/use-message';

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: '삐삑, 나는야 <b>Kakao Developers helper BOT.</b>',
  },
];

export default function KakaoPage() {
  const { chatAreaRef, messages, handleSend } = useMessage({
    apiUrl: '/api/kakao',
    initialMessages,
  });

  return (
    <div className='absolute inset-0 top-16'>
      <div className='mx-auto flex flex-col w-full h-full md:w-1/2 '>
        <div ref={chatAreaRef} className='flex-1 overflow-auto px-2 pt-10 space-y-4'>
          <ChatArea messages={messages} />
        </div>
        <div className='pb-20 px-2 pt-4'>
          <InputArea handleSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
