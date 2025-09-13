import ProtocolIdentifierTool from '@/components/protocol-identifier-tool';

export default function ProtocolIdentifierPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 md:py-24">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Protocol Identifier
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Describe your project's requirements, and our AI will recommend the most suitable blockchain protocol for you.
        </p>
      </div>
      <ProtocolIdentifierTool />
    </div>
  );
}
