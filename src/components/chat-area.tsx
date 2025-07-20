
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Download, Loader2, Send, Sparkles, User } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getAiResponse, getSummary } from '@/lib/actions';
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

export function ChatArea() {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm FlutterFlow AI. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [summary, setSummary] = React.useState('');
  const [isSummaryLoading, setIsSummaryLoading] = React.useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = React.useState(false);
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

  const handleDownload = () => {
    const fileContent = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flutterflow-ai-chat.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSummarize = async () => {
    setIsSummaryLoading(true);
    const result = await getSummary(messages);
    setIsSummaryLoading(false);
    if (result.success && result.summary) {
      setSummary(result.summary);
      setIsSummaryDialogOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description:
          result.error || 'Could not generate a summary of the conversation.',
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof chatFormSchema>) => {
    const userMessage: Message = { role: 'user', content: data.message };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    form.reset();

    const result = await getAiResponse(
      messages,
      data.message
    );
    setIsLoading(false);

    if (result.success) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.response,
      };
      setMessages([...newMessages, assistantMessage]);
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
      setMessages([...newMessages, errorMessage]);
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
                FlutterFlow AI Assistant
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSummarize}
                disabled={isSummaryLoading || messages.length <= 1}
                aria-label="Summarize Conversation"
              >
                {isSummaryLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
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
                        : 'bg-muted'
                    )}
                  >
                    {message.content.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
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
                          placeholder="Ask about FlutterFlow or anything else..."
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

      <AlertDialog
        open={isSummaryDialogOpen}
        onOpenChange={setIsSummaryDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">
              Conversation Summary
            </AlertDialogTitle>
            <AlertDialogDescription className="max-h-80 overflow-y-auto">
              {summary}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setIsSummaryDialogOpen(false)}>Close</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
