'use client';

import { useState } from 'react';
import type { SupportRequest } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu } from 'lucide-react';
import RequestSummaryModal from './request-summary-modal';
import { formatDistanceToNow } from 'date-fns';

type DashboardClientProps = {
  requests: SupportRequest[];
};

export default function DashboardClient({ requests }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

  const handleSummarizeClick = (request: SupportRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Submitted</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="font-medium">{request.name}</div>
                  <div className="text-sm text-muted-foreground">{request.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={request.type === 'Subscription' ? 'default' : 'secondary'}>
                    {request.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDistanceToNow(new Date(request.timestamp), { addSuffix: true })}
                </TableCell>
                <TableCell className="max-w-sm truncate">{request.message}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSummarizeClick(request)}
                  >
                    <Cpu className="mr-2 h-4 w-4" />
                    Summarize
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <RequestSummaryModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        request={selectedRequest}
      />
    </>
  );
}
