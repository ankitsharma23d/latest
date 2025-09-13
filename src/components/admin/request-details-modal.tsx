'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { SupportRequest } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { User, Mail, Calendar, MessageSquare } from 'lucide-react';

type RequestDetailsModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  request: SupportRequest | null;
};

export default function RequestDetailsModal({
  isOpen,
  onOpenChange,
  request,
}: RequestDetailsModalProps) {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Request Details</DialogTitle>
          <DialogDescription>
            Full details for support request #{request.id}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className='w-full'>
              <p className="text-sm text-muted-foreground">User</p>
              <p className="font-medium">{request.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className='w-full'>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{request.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className='w-full'>
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="font-medium">
                {format(new Date(request.timestamp), 'PPP p')}
              </p>
            </div>
             <Badge variant={request.type === 'Subscription' ? 'default' : 'secondary'}>
                {request.type}
              </Badge>
          </div>
          <div className="flex items-start gap-4">
            <MessageSquare className="h-5 w-5 text-muted-foreground mt-1" />
            <div className='w-full'>
              <p className="text-sm text-muted-foreground">Message</p>
              <p className="text-sm bg-secondary p-3 rounded-md whitespace-pre-wrap">
                {request.message}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
