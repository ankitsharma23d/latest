'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { submitSubscriptionQuery } from '@/lib/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROTOCOLS } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

const subscriptionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  protocol: z.string().min(1, 'Protocol is required.'),
  otherProtocol: z.string().optional(),
  networkType: z.string().min(1, 'Network Type is required.'),
  otherNetworkType: z.string().optional(),
  nodeType: z.string().min(1, 'Node Type is required.'),
  otherNodeType: z.string().optional(),
  query: z.string().min(10, 'Query must be at least 10 characters.'),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

export default function SubscriptionQueryForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: '',
      email: '',
      protocol: '',
      otherProtocol: '',
      networkType: '',
      otherNetworkType: '',
      nodeType: '',
      otherNodeType: '',
      query: '',
    },
  });

  const protocolValue = watch('protocol');
  const networkTypeValue = watch('networkType');
  const nodeTypeValue = watch('nodeType');

  const onSubmit = (data: SubscriptionFormValues) => {
    startTransition(async () => {
      const result = await submitSubscriptionQuery(null, data);

      if (result?.message && !result.errors) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        reset();
      } else if (result?.message && result.errors) {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  if (!isClient) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="Your Name" disabled={isPending} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              disabled={isPending}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Protocol</Label>
            <Select
              onValueChange={(value) => setValue('protocol', value, { shouldValidate: true })}
              value={protocolValue}
              name="protocol"
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a protocol" />
              </SelectTrigger>
              <SelectContent>
                {PROTOCOLS.map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.protocol && (
              <p className="text-sm text-destructive">{errors.protocol.message}</p>
            )}
            {protocolValue === 'Other' && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="otherProtocol">Please specify protocol</Label>
                <Input
                  id="otherProtocol"
                  {...register('otherProtocol')}
                  placeholder="e.g., Bitcoin"
                  disabled={isPending}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Network Type</Label>
            <Select
              onValueChange={(value) => setValue('networkType', value, { shouldValidate: true })}
              value={networkTypeValue}
              name="networkType"
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a network type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mainnet">Mainnet</SelectItem>
                <SelectItem value="Testnet">Testnet</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.networkType && (
              <p className="text-sm text-destructive">{errors.networkType.message}</p>
            )}
            {networkTypeValue === 'Other' && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="otherNetworkType">Please specify network type</Label>
                <Input
                  id="otherNetworkType"
                  {...register('otherNetworkType')}
                  placeholder="e.g., Devnet"
                  disabled={isPending}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Node Type</Label>
            <Select
              onValueChange={(value) => setValue('nodeType', value, { shouldValidate: true })}
              value={nodeTypeValue}
              name="nodeType"
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a node type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RPC">RPC</SelectItem>
                <SelectItem value="Archive">Archive</SelectItem>
                <SelectItem value="Validator">Validator</SelectItem>
                <SelectItem value="Collator">Collator</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.nodeType && (
              <p className="text-sm text-destructive">{errors.nodeType.message}</p>
            )}
            {nodeTypeValue === 'Other' && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="otherNodeType">Please specify node type</Label>
                <Input
                  id="otherNodeType"
                  {...register('otherNodeType')}
                  placeholder="e.g., Full Node"
                  disabled={isPending}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="query">Your Query</Label>
            <Textarea
              id="query"
              {...register('query')}
              placeholder="What are your questions about our subscription plans?"
              rows={5}
              disabled={isPending}
            />
            {errors.query && (
              <p className="text-sm text-destructive">{errors.query.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Query'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
