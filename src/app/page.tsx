import { getChats } from '~/lib/fetchers';
import { Separator } from '~/components/ui/separator';
import { ChatCard } from '~/components/chat-card';
import { CreateChat } from '~/components/forms/create-chat';
import { SiteHeader } from '~/components/layouts/site-header';

export default async function HomePage() {
  const chats = await getChats();

  return (
    <>
      <SiteHeader />
      <main className='container py-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Your Chats</h1>
          <CreateChat />
        </div>
        <Separator className='mt-2.5' />
        {chats?.length === 0 && <p className='py-10'>No Chats yet...</p>}
        <section className='grid gap-6 py-10 md:grid-cols-2 lg:grid-cols-3'>
          {chats?.map(chat => <ChatCard key={chat.id} chat={chat} />)}
        </section>
      </main>
    </>
  );
}
