// src/components/chat-area.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Clipboard, Check, Download, Loader2, Send, User, Link as LinkIcon } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getAiResponse } from '@/lib/actions';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const chatFormSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
});

interface ChatAreaProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  geminiKey: string;
  googleSearchKey: string;
}

export function ChatArea({ messages, setMessages, geminiKey, googleSearchKey }: ChatAreaProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [copiedStates, setCopiedStates] = React.useState<Record<string, boolean>>({});
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof chatFormSchema>>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      message: '',
    },
  });

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({...prev, [id]: true}));
    setTimeout(() => {
      setCopiedStates(prev => ({...prev, [id]: false}));
    }, 2000);
  };

  const handleDownload = () => {
    const fileContent = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('');
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'work-scraper-chat.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const onSubmit = async (data: z.infer<typeof chatFormSchema>) => {
    if (!geminiKey || !googleSearchKey) {
      toast({
        variant: 'destructive',
        title: 'API Keys Missing',
        description: 'Please provide your API keys in the API Keys page.',
      });
      return;
    }

    const userMessage: Message = { role: 'user', content: data.message };
    const findingWorkMessage: Message = { role: 'assistant', content: 'finding jobs' };
    const newMessages = [...messages, userMessage, findingWorkMessage];
    setMessages(newMessages);
    setIsLoading(true);
    form.reset();

    // Pass the geminiKey to getAiResponse
    const result = await getAiResponse([], data.message, geminiKey);
    setIsLoading(false);

    if (result.success) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: Array.isArray(result.response) ? result.response.join('\n') : result.response ?? 'An error occurred and no response was received.',
      };

      setMessages(newMessages.filter(msg => msg.content !== 'finding jobs').concat(assistantMessage));
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      const errorMessage: Message = {
        role: 'assistant',
        content:
          'Sorry, something went wrong. Please try again.',
      };
      setMessages(newMessages.filter(msg => msg.content !== 'finding jobs').concat(errorMessage));
    }
  };

  const onTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = 'auto';
    const maxHeight = 200;
    target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
  };

  return (
    <>
      <Card className="w-full max-w-3xl h-full max-h-[90dvh] flex flex-col shadow-2xl rounded-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              <CardTitle className="font-headline text-2xl">
                Work Scraper
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                disabled={messages.length <= 1}
                aria-label="Download Chat History"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-4',
                    message.role === 'user' ? 'justify-end' : ''
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback>
                        <Bot className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-md rounded-xl px-4 py-3 text-sm shadow-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted',
                      message.role === 'assistant' && message.content.includes('\n') && 'w-full max-w-xl'
                    )}
                  >
                    {message.role === 'assistant' && message.content.includes('\n') ? (
                      <div className="space-y-2">
                        {message.content.split('\n').filter(line => line.trim()).map((line, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-md bg-background/50">
                            <span className="font-mono text-xs flex-grow">{line}</span>
                            <div className="flex items-center shrink-0 ml-2">
                              <a href={`https://www.google.com/search?q=${encodeURIComponent(line)}`} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <LinkIcon className="h-3 w-3" />
                                </Button>
                              </a>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleCopy(line, `${index}-${i}`)}
                              >
                                {copiedStates[`${index}-${i}`] ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Clipboard className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback>
                        <User className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9 border">
                     <AvatarFallback>
                        <Bot className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                  </Avatar>
                  <div className="max-w-md rounded-xl bg-muted px-4 py-3 text-sm shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      Typing...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-4 bg-background/80 backdrop-blur-sm">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-start gap-2"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder="Enter keywords or a domain to find jobs..."
                          className="max-h-48 resize-none"
                          rows={1}
                          onInput={onTextareaInput}
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (form.formState.isValid) {
                                form.handleSubmit(onSubmit)();
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="icon" disabled={isLoading} aria-label="Send Message">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
