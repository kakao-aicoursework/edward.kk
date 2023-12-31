'use client';

import InputArea from '@/components/inputarea';
import ChatArea from '@/components/chatarea';

import { Message } from '@/lib/types';
import useMessage from '@/lib/use-message';

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
  const { chatAreaRef, messages, handleSend } = useMessage({
    apiUrl: '/api/chat',
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
