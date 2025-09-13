'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { SupportRequest } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import {
  User,
  Mail,
  Calendar,
  MessageSquare,
  Layers,
  Network,
  GitBranchPlus,
  FileText,
} from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { updateRequestNotes } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

type RequestDetailsModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  request: SupportRequest | null;
  onNotesUpdate: (requestId: string, notes: string) => void;
};

export default function RequestDetailsModal({
  isOpen,
  onOpenChange,
  request,
  onNotesUpdate,
}: RequestDetailsModalProps) {
  const [notes, setNotes] = useState(request?.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  if (!request) return null;

  const handleSaveNotes = async () => {
    setIsSaving(true);
    const result = await updateRequestNotes(request.id, notes);
    setIsSaving(false);

    if (result.success) {
      onNotesUpdate(request.id, notes);
      toast({
        title: 'Notes Saved',
        description: 'Your notes have been successfully saved.',
      });
    } else {
      toast({
        title: 'Save Failed',
        description: 'Could not save the notes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isSubscription = request.type === 'Subscription';

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
          {/* ... existing details ... */}
          <div className="flex items-start gap-4">
            <FileText className="h-5 w-5 text-muted-foreground mt-1" />
            <div className="w-full">
              <p className="text-sm text-muted-foreground">Notes</p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes for this request..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveNotes} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Notes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
