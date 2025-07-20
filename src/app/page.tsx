import { ChatArea } from '@/components/chat-area';

export default function Home() {
  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center bg-background p-2 sm:p-4">
      <ChatArea />
    </main>
  );
}
