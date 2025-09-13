'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  sender: 'user' | 'agent';
  text: string;
};

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'details' | 'chat'>('details');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 'chat' && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          { sender: 'agent', text: `Hi ${userName}! How can I help you today?` },
        ]);
      }, 500);
    }
  }, [step, userName, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to bottom. In a real app use a more robust solution.
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  const handleStartChat = (e: FormEvent) => {
    e.preventDefault();
    if (userName && userEmail) {
      console.log('Starting chat for:', { userName, userEmail });
      setStep('chat');
    }
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const agentResponse: Message = {
        sender: 'agent',
        text: "Thanks for your message. I'm connecting you to a specialist. Please wait a moment.",
      };
      setMessages((prev) => [...prev, agentResponse]);
    }, 1500);
  };

  const resetChat = () => {
    setIsOpen(false);
    setTimeout(() => {
        setStep('details');
        setMessages([]);
        setUserName('');
        setUserEmail('');
    }, 300);
  }

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open live chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      <Sheet open={isOpen} onOpenChange={(open) => !open ? resetChat() : setIsOpen(true)}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Live Support</SheetTitle>
            <SheetDescription>
              {step === 'details'
                ? 'Please provide your details to start chatting.'
                : `You are now chatting with our support team.`}
            </SheetDescription>
          </SheetHeader>

          {step === 'details' && (
            <form onSubmit={handleStartChat} className="space-y-4 p-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Start Chat
              </Button>
            </form>
          )}

          {step === 'chat' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={cn(
                            'flex items-end gap-2',
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {msg.sender === 'agent' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            )}
                            <div
                            className={cn(
                                'max-w-xs rounded-lg px-4 py-2 text-sm',
                                msg.sender === 'user'
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
                    />
                    <Button type="submit" size="icon" aria-label="Send message">
                    <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LiveChat;
