'use client';

import { useState } from 'react';
import type { SupportRequest, Status } from '@/lib/types';
import { STATUSES } from '@/lib/types';
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
import { Cpu, MoreVertical } from 'lucide-react';
import RequestSummaryModal from './request-summary-modal';
import RequestDetailsModal from './request-details-modal';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DashboardClientProps = {
  initialRequests: SupportRequest[];
};

export default function DashboardClient({ initialRequests }: DashboardClientProps) {
  const [requests, setRequests] = useState<SupportRequest[]>(initialRequests);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

  const handleSummarizeClick = (e: React.MouseEvent, request: SupportRequest) => {
    e.stopPropagation();
    setSelectedRequest(request);
    setIsSummaryModalOpen(true);
  };

  const handleRowClick = (request: SupportRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleStatusChange = (requestId: string, newStatus: Status) => {
    // In a real app, you'd call an API to update the status in your database.
    // For this demo, we'll just update the local state.
    console.log(`Updating request ${requestId} to status: ${newStatus}`);
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Submitted</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow
                key={request.id}
                onClick={() => handleRowClick(request)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="font-medium">{request.name}</div>
                  <div className="text-sm text-muted-foreground">{request.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={request.type === 'Subscription' ? 'default' : 'secondary'}>
                    {request.type}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-left font-normal">
                        {request.status}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {STATUSES.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onSelect={() => handleStatusChange(request.id, status)}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDistanceToNow(new Date(request.timestamp), { addSuffix: true })}
                </TableCell>
                <TableCell className="max-w-xs truncate">{request.message}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => handleRowClick(request)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => handleSummarizeClick(e, request)}>
                         <Cpu className="mr-2 h-4 w-4" />
                        Summarize
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <RequestSummaryModal
        isOpen={isSummaryModalOpen}
        onOpenChange={setIsSummaryModalOpen}
        request={selectedRequest}
      />
      <RequestDetailsModal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        request={selectedRequest}
      />
    </>
  );
}
