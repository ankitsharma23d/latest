import SubscriptionQueryForm from '@/components/forms/subscription-query-form';

export default function SubscriptionQueryPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 md:py-24">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Subscription Queries
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Have questions about our subscription plans? Let us know how we can help.
        </p>
      </div>
      <SubscriptionQueryForm />
    </div>
  );
}
