import { Separator } from '~/components/ui/separator';
import { CreateChat } from '~/components/create-chat';

export default function HomePage() {
  return (
    <main className='container py-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Your Chats</h1>
        <CreateChat />
      </div>
      <Separator className='mt-2.5' />
    </main>
  );
}
