'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { runProtocolIdentifier } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

type ProtocolResult = {
  protocol: string;
  reason: string;
};

export default function ProtocolIdentifierTool() {
  const [needs, setNeeds] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProtocolResult | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await runProtocolIdentifier(needs);

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setResult(response.data);
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Describe Your Needs</CardTitle>
        <CardDescription>
          Be specific about what you are trying to build. Mention transaction speed, consensus mechanism, smart contract language, or any other technical requirement.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="needs" className="sr-only">Your project needs</Label>
            <Textarea
              id="needs"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              placeholder="e.g., 'I am building a high-frequency trading application that requires sub-second transaction finality and compatibility with the Ethereum Virtual Machine...'"
              rows={6}
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Analyzing...' : 'Identify Protocol'}
          </Button>
        </CardFooter>
      </form>

      {loading && (
        <CardContent>
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </CardContent>
      )}

      {error && (
        <CardContent>
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </CardContent>
      )}

      {result && (
        <CardContent>
            <h3 className="font-bold text-lg font-headline mb-2">Recommended Protocol: <span className="text-primary">{result.protocol}</span></h3>
            <p className="text-muted-foreground">{result.reason}</p>
        </CardContent>
      )}
    </Card>
  );
}
