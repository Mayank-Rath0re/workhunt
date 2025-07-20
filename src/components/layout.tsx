
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { ChatArea } from "./chat-area";
import { ApiKeysPage } from "./api-keys-page";
import type { Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('chat'); // 'chat', 'saved-chats', 'api-keys'
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Work Scraper. How can I help you find jobs today?",
    },
  ]);
  const [savedChats, setSavedChats] = useState<Message[][]>([]);
  const [geminiKey, setGeminiKey] = useState('');
  const [googleSearchKey, setGoogleSearchKey] = useState('');

  const { toast } = useToast(); // Get the toast function

  const handleNewChat = () => {
    if (messages.length > 1) { // Only save if there's a conversation beyond the initial message
      setSavedChats([...savedChats, messages]);
    }
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm Work Scraper. How can I help you find jobs today?",
      },
    ]);
    setCurrentPage('chat');
    setIsOpen(false);
  };

  const handleSavedChats = () => {
    setCurrentPage('saved-chats');
    setIsOpen(false);
  };

  const handleApiKeys = () => {
    setCurrentPage('api-keys');
    setIsOpen(false);
  };

  const handleSaveApiKeys = (gemini: string, googleSearch: string) => {
    setGeminiKey(gemini);
    setGoogleSearchKey(googleSearch);
    setIsOpen(false); // Close the drawer after saving
    toast({
      // Trigger the toast notification
      title: "API Keys Saved Successfully",
    });
  };

  return (
    <div className="flex h-screen">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="m-4">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-4 p-4">
            <Button variant="ghost" onClick={handleNewChat}>New Chat</Button>
            <Button variant="ghost" onClick={handleSavedChats}>Saved Chats</Button>
            <Button variant="ghost" onClick={handleApiKeys}>API Keys</Button>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex items-center justify-center">
        {currentPage === 'chat' && <ChatArea messages={messages} setMessages={setMessages} geminiKey={geminiKey} googleSearchKey={googleSearchKey} />}
        {currentPage === 'saved-chats' && (
          <div>
            <h2>Saved Chats</h2>
            {savedChats.map((chat, index) => (
              <div key={index} className="border p-2 mb-2">
                {/* Display a summary or the first few messages of each saved chat */}
                Chat {index + 1}
              </div>
            ))}
          </div>
        )}
        {currentPage === 'api-keys' && (
          <ApiKeysPage
            geminiKey={geminiKey}
            googleSearchKey={googleSearchKey}
            onSave={handleSaveApiKeys}
          />
        )}
      </div>
    </div>
  );
}
