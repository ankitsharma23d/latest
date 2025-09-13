import { PROTOCOLS } from '@/lib/data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SupportedProtocolsPage() {
  return (
    <div className="container mx-auto py-12 md:py-24">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Supported Protocols
        </h1>
        <p className="text-muted-foreground md:text-xl max-w-3xl mx-auto">
          We provide robust, scalable, and reliable infrastructure for a wide range of blockchain networks.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {PROTOCOLS.map((protocol) => (
          <Card key={protocol.name} className="flex flex-col items-center justify-center p-6 text-center hover:bg-secondary/50 transition-colors">
            <protocol.icon className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-base">{protocol.name}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
}
