'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageSquare, Send } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { startChatSession, sendChatMessage } from '@/lib/actions';
import { collection, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Message = {
  sender: 'user' | 'agent';
  text: string;
  timestamp: Timestamp;
};

type ConnectionStatus = 'connecting' | 'connected' | 'error';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'details' | 'chat'>('details');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Restore chat session from localStorage on component mount
  useEffect(() => {
    const storedChatId = localStorage.getItem('liveChatId');
    const storedUserName = localStorage.getItem('liveChatUserName');
    if (storedChatId && storedUserName) {
      setChatId(storedChatId);
      setUserName(storedUserName);
      setStep('chat');
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Firebase listener for new messages
  useEffect(() => {
    if (!chatId) return;

    setConnectionStatus('connecting');
    const q = query(collection(db, 'requests', chatId, 'messages'), orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const newMessages = querySnapshot.docs.map(doc => doc.data() as Message);
        
        // CORRECTED LOGIC:
        // If it's a restored session with no messages, add the initial agent message.
        if (newMessages.length === 0 && userName) {
            // @ts-ignore
            newMessages.push({ sender: 'agent', text: `Hi ${userName}! How can I help you today?`, timestamp: Timestamp.now() });
        }

        setMessages(newMessages);
        setConnectionStatus('connected');
      },
      (err) => {
        console.error("LiveChat: Error in snapshot listener:", err);
        setConnectionStatus('error');
      }
    );

    return () => unsubscribe();
  }, [chatId, userName]); // Added userName dependency

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleStartChat = async (e: FormEvent) => {
    e.preventDefault();
    if (userName && userEmail) {
      const result = await startChatSession({ name: userName, email: userEmail });
      if (result.success && result.chatId) {
        // Save session to localStorage
        localStorage.setItem('liveChatId', result.chatId);
        localStorage.setItem('liveChatUserName', userName);
        
        setChatId(result.chatId);
        setStep('chat');
        // This is still needed for brand new chats
        // @ts-ignore
        setMessages([ { sender: 'agent', text: `Hi ${userName}! How can I help you today?`, timestamp: Timestamp.now() } ]);
      } else {
        console.error('Failed to start chat session', result.error);
      }
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatId || isSending) return;

    setIsSending(true);
    const text = inputValue;
    setInputValue('');

    const result = await sendChatMessage({ chatId, sender: 'user', text });

    if (!result.success) {
      console.error('Failed to send message', result.message);
      setInputValue(text); // Re-populate the input on failure
    }
    setIsSending(false);
  };

  // Explicitly end the chat session and clear localStorage
  const endChatSession = () => {
    localStorage.removeItem('liveChatId');
    localStorage.removeItem('liveChatUserName');
    
    setIsOpen(false);
    setTimeout(() => {
      setStep('details');
      setMessages([]);
      setUserName('');
      setUserEmail('');
      setChatId(null);
    }, 300); // Allow sheet to animate out
  };

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open live chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      {/* Changed onOpenChange to only control the open state */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <div className="flex justify-between items-center">
              <SheetTitle>Live Support</SheetTitle>
              {/* Add an "End Chat" button */}
              {step === 'chat' && (
                <Button variant="outline" size="sm" onClick={endChatSession}>
                  End Chat
                </Button>
              )}
            </div>
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
                  ))}\
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
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LiveChat;
