'use client';

import { useState, useEffect } from 'react';
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
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { updateRequestStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


export default function DashboardClient() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'requests'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requestsData: SupportRequest[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        requestsData.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          type: data.type,
          message: data.message,
          // Convert Firestore Timestamp to JS Date string, fallback to now
          timestamp: (data.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          status: data.status,
        });
      });
      
      // Sort requests by timestamp client-side
      requestsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setRequests(requestsData);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching requests:", error);
        toast({
            title: "Error",
            description: "Failed to fetch support requests.",
            variant: "destructive"
        });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


  const handleSummarizeClick = (e: React.MouseEvent, request: SupportRequest) => {
    e.stopPropagation();
    setSelectedRequest(request);
    setIsSummaryModalOpen(true);
  };

  const handleRowClick = (request: SupportRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleStatusChange = async (requestId: string, newStatus: Status) => {
    const originalRequests = [...requests];
    // Optimistically update the UI
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );

    const result = await updateRequestStatus(requestId, newStatus);

    if (!result.success) {
      // Revert the change if the update fails
      setRequests(originalRequests);
      toast({
        title: 'Update Failed',
        description: 'Could not update the request status.',
        variant: 'destructive',
      });
    } else {
         toast({
            title: 'Status Updated',
            description: `Request status changed to "${newStatus}".`,
        });
    }
  };
  
    if (isLoading) {
        return (
            <div className="border rounded-lg p-4">
                 <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        )
    }

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
                className="cursor-pointer hover:bg-card transition-colors"
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
                      <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal min-w-[150px]">
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
                  {request.timestamp ? formatDistanceToNow(new Date(request.timestamp), { addSuffix: true }) : 'N/A'}
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
         {requests.length === 0 && !isLoading && (
            <div className="text-center p-8 text-muted-foreground">
                No support requests yet.
            </div>
        )}
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
