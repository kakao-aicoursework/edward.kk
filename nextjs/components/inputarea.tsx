import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { SendIcon } from './ui/icons';

export default function InputArea({ handleSend }: { handleSend: Function }) {
  const [query, setQuery] = useState<string>('');

  const send = () => {
    handleSend(query);
    setQuery('');
  };

  return (
    <div className='relative w-full'>
      <div className='flex w-full'>
        <Input
          type='query'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              send(); // Enter 입력이 되면 클릭 이벤트 실행
            }
          }}
          placeholder='Send a message'
          className='rounded-r-none text-base focus-visible:ring-0'
        />
        <Button type='submit' className='rounded-none rounded-r-md' onClick={send}>
          <SendIcon className='h-5 w-5' />
        </Button>
      </div>
    </div>
  );
}
