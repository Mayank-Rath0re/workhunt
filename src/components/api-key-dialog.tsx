
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const apiKeySchema = z.object({
  geminiKey: z.string().min(1, { message: 'API Key cannot be empty.' }),
});

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySubmit: (key: string) => void;
}

export function ApiKeyDialog({ isOpen, onClose, onApiKeySubmit }: ApiKeyDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      geminiKey: '',
    },
  });

  const onSubmit = (data: z.infer<typeof apiKeySchema>) => {
    setIsSaving(true);
    onApiKeySubmit(data.geminiKey);
    setIsSaving(false);
    toast({
      title: 'API Key Saved',
      description: 'Your Gemini API key has been saved for this session.',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-6 w-6" />
            Provide API Key
          </DialogTitle>
          <DialogDescription>
            Please enter your Gemini API key to use the chat functionality. Your
            key is stored only in your browser for this session.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="geminiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gemini API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
