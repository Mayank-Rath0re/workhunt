
'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Bot, FilePlus, KeyRound, List } from 'lucide-react';
import { ChatArea } from "./chat-area";
import type { Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ApiKeyDialog } from './api-key-dialog';

export function Layout() {
  const [currentPage, setCurrentPage] = useState('chat'); // 'chat', 'saved-chats'
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Work Scraper. Provide an API Key to get started.",
    },
  ]);
  const [savedChats, setSavedChats] = useState<Message[][]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
 
  const { toast } = useToast();

  const handleNewChat = () => {
    if (messages.length > 1) {
      setSavedChats([...savedChats, messages]);
    }
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm Work Scraper. How can I help you find jobs today?",
      },
    ]);
    setCurrentPage('chat');
  };

  React.useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setIsApiKeyDialogOpen(true);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">Work Scraper</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleNewChat} isActive={currentPage === 'chat'} tooltip="Start a new chat">
                <FilePlus />
                New Chat
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setCurrentPage('saved-chats')} isActive={currentPage === 'saved-chats'} tooltip="View saved chats">
                <List />
                Saved Chats
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setIsApiKeyDialogOpen(true)} tooltip="Set API Key">
                <KeyRound />
                API Key
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex items-center justify-center p-4">
        <div className="absolute top-4 left-4">
           <SidebarTrigger />
        </div>
        <div className="w-full h-full flex items-center justify-center">
            {currentPage === 'chat' && <ChatArea messages={messages} setMessages={setMessages} apiKey={apiKey} onMissingApiKey={() => setIsApiKeyDialogOpen(true)} />}
            {currentPage === 'saved-chats' && (
              <Card className="w-full max-w-3xl">
                <CardHeader>
                  <CardTitle>Saved Chats</CardTitle>
                </CardHeader>
                <CardContent>
                  {savedChats.length > 0 ? (
                    <ul className="space-y-2">
                      {savedChats.map((chat, index) => (
                        <li key={index} className="border p-4 rounded-md hover:bg-muted transition-colors">
                          <p className="font-semibold">Chat {index + 1}</p>
                          <p className="text-sm text-muted-foreground truncate">{chat[1]?.content || 'Empty chat'}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No saved chats yet.</p>
                  )}
                </CardContent>
              </Card>
            )}
        </div>
      </SidebarInset>
      <ApiKeyDialog 
        isOpen={isApiKeyDialogOpen}
        onClose={() => setIsApiKeyDialogOpen(false)}
        onApiKeySubmit={handleApiKeySubmit}
      />
    </SidebarProvider>
  );
}
