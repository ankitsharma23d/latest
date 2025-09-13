'use client';

import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { submitSubscriptionQuery } from '@/lib/actions';

const subscriptionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  query: z.string().min(10, 'Query must be at least 10 characters.'),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Query'}
    </Button>
  );
}

export default function SubscriptionQueryForm() {
  const [state, formAction] = useActionState(submitSubscriptionQuery, null);
  const { toast } = useToast();

  const {
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: { name: '', email: '', query: '' },
  });
  
  useEffect(() => {
    if (state?.message && !state.errors) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      reset();
    } else if (state?.message && state.errors) {
       toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, reset]);
  
  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="Your Name" />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="your@email.com" />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="query">Your Query</Label>
            <Textarea
              id="query"
              {...register('query')}
              placeholder="What are your questions about our subscription plans?"
              rows={5}
            />
            {errors.query && (
              <p className="text-sm text-destructive">{errors.query.message}</p>
            )}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
