import { useEffect } from 'react';
import { SpinnerIcon } from './ui/icons';

export default function ChatArea({
  messages,
  scrollToBottom,
}: {
  messages: Array<any>;
  scrollToBottom: Function;
}) {
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {messages.map((message, index) => {
        if (message.role === 'assistant' && message.status === 'thinking') {
          return (
            <div className='flex justify-start' key={index}>
              <div className='max-w-full whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2'>
                <SpinnerIcon className='text-zinc-800' />
              </div>
            </div>
          );
        } else if (message.role === 'assistant') {
          return (
            <div className='flex justify-start' key={index}>
              <div className='max-w-full whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2'>
                {message.content}
              </div>
            </div>
          );
        } else if (message.role === 'user') {
          return (
            <div className='flex justify-end' key={index}>
              <div>
                <div className='max-w-full whitespace-pre-wrap rounded-xl bg-zinc-900 px-4 py-2 text-white'>
                  {message.content}
                </div>
              </div>
            </div>
          );
        }
      })}
    </>
  );
}
