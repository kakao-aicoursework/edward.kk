'use client';

import InputArea from '@/components/inputarea';
import ChatArea from '@/components/chatarea';

import { Message } from '@/lib/types';
import useMessage from '@/lib/use-message';

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: '<b>한</b> to the <b>영</b>, 과정을 친절히 설명해주는 번역 챗봇 입니다.',
  },
];

export default function TranslatePage() {
  const { chatAreaRef, messages, handleSend } = useMessage({
    apiUrl: '/api/translate',
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
