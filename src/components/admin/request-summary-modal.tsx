'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Bot, User, Wrench } from 'lucide-react';
import type { SupportRequest } from '@/lib/types';
import { runRequestSummary } from '@/lib/actions';

type RequestSummaryModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  request: SupportRequest | null;
};

type SummaryData = {
  summary: string;
  userNeed: string;
  suggestedService: string;
};

export default function RequestSummaryModal({
  isOpen,
  onOpenChange,
  request,
}: RequestSummaryModalProps) {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && request) {
      const fetchSummary = async () => {
        setIsLoading(true);
        setError(null);
        setSummaryData(null);

        const result = await runRequestSummary(request.message);
        if (result.data) {
          setSummaryData(result.data);
        } else {
          setError(result.error || 'An unknown error occurred.');
        }
        setIsLoading(false);
      };

      fetchSummary();
    }
  }, [isOpen, request]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">AI Request Summary</DialogTitle>
          <DialogDescription>
            AI-generated summary and suggestions for request #{request?.id}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {summaryData && (
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                    <Bot className="mr-2 h-4 w-4" />
                    Summary
                </h3>
                <p className="text-sm bg-secondary p-3 rounded-md">{summaryData.summary}</p>
              </div>
              <div>
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                    <User className="mr-2 h-4 w-4" />
                    User Need
                </h3>
                <p className="text-sm bg-secondary p-3 rounded-md">{summaryData.userNeed}</p>
              </div>
              <div>
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                    <Wrench className="mr-2 h-4 w-4" />
                    Suggested Service
                </h3>
                <p className="text-sm bg-secondary p-3 rounded-md">{summaryData.suggestedService}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
