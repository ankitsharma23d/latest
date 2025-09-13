'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SupportRequest } from '@/lib/types';
import { collection, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendChatMessage } from '@/lib/actions';

type Message = {
  sender: 'user' | 'agent';
  text: string;
  timestamp: Timestamp;
};

type ConnectionStatus = 'connecting' | 'connected' | 'error';

interface LiveChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  request: SupportRequest | null;
}

const LiveChatModal = ({ isOpen, onOpenChange, request }: LiveChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!request?.id) return;

    setConnectionStatus('connecting');
    const q = query(collection(db, 'requests', request.id, 'messages'), orderBy('timestamp'));

    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const newMessages = querySnapshot.docs.map(doc => doc.data() as Message);
        setMessages(newMessages);
        setConnectionStatus('connected');
      },
      (err) => {
        console.error("LiveChatModal: Error in snapshot listener:", err);
        setConnectionStatus('error');
      }
    );

    return () => unsubscribe();
  }, [request?.id]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !request?.id || isSending) return;

    setIsSending(true);
    const text = inputValue;
    setInputValue('');

    const result = await sendChatMessage({ chatId: request.id, sender: 'agent', text });

    if (!result.success) {
      console.error('Failed to send message', result.message);
      setInputValue(text);
    }
    setIsSending(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle>Live Chat with {request?.name}</DialogTitle>
          <DialogDescription>{request?.email}</DialogDescription>
        </DialogHeader>
        {connectionStatus === 'connecting' && <div className="p-2 text-center text-xs text-muted-foreground">Connecting...</div>}
        {connectionStatus === 'error' && 
            <div className="p-2 text-center text-xs text-destructive bg-destructive/10">
                Connection error. Please check your network for firewall restrictions.
            </div>
        }
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-end gap-2',
                  msg.sender === 'agent' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{request?.name?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg px-4 py-2 text-sm',
                    msg.sender === 'agent'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 border-t p-4"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            autoComplete="off"
            disabled={isSending || connectionStatus !== 'connected'}
          />
          <Button type="submit" size="icon" aria-label="Send message" disabled={isSending || connectionStatus !== 'connected'}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LiveChatModal;
