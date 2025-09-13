import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Blocks,
  Briefcase,
  Contact,
  Cpu,
  Fingerprint,
  MessageSquareQuote,
  Network,
  Rocket,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContactForm from '@/components/forms/contact-form';
import { PROTOCOLS } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

const features = [
  {
    icon: <Fingerprint className="h-8 w-8 text-primary" />,
    title: 'Protocol Identifier',
    description: 'Use our AI to analyze your project needs and recommend the perfect blockchain protocol.',
    link: '/protocol-identifier',
    linkText: 'Find Your Protocol',
  },
  {
    icon: <MessageSquareQuote className="h-8 w-8 text-primary" />,
    title: 'Request Summary',
    description: 'Admins can leverage AI to get quick summaries of user requests, identifying needs instantly.',
    link: '/admin/dashboard',
    linkText: 'Go to Admin',
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: 'Supported Protocols',
    description: 'We support a vast array of the most popular and powerful blockchain protocols.',
    link: '/protocols',
    linkText: 'View All Protocols',
  },
];

const services = [
    {
        icon: <Rocket className="h-8 w-8 text-primary" />,
        title: 'One-Time Node Setup',
        description: 'A single setup fee to get your blockchain node up and running.',
        price: 'Starts at $50',
    },
    {
        icon: <Wrench className="h-8 w-8 text-primary" />,
        title: 'Maintenance as a Service',
        description: 'Ongoing support and maintenance to ensure your node is always optimal.',
        price: 'Starts at $50/month',
    },
    {
        icon: <Briefcase className="h-8 w-8 text-primary" />,
        title: 'Fully Managed Enterprise',
        description: 'A complete, hands-off solution for large-scale enterprise needs.',
        price: 'Custom Quote',
        link: '/contact',
    },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-card/50">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter font-headline">
            InfraSage
          </h1>
          <p className="max-w-[700px] mx-auto text-lg md:text-xl text-muted-foreground">
            AI-powered insights and tools to navigate the complex world of blockchain infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/protocol-identifier">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover -z-10 opacity-10"
            data-ai-hint={heroImage.imageHint}
          />
        )}
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
              Core Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Smarter Blockchain Development
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our suite of AI tools provides unparalleled support for selecting, integrating, and managing blockchain protocols.
            </p>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-1 md:grid-cols-2 lg:max-w-5xl lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card/50 hover:bg-card/90 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{feature.description}</p>
                   <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={feature.link}>
                      {feature.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-card/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
              Our Services
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Flexible Plans for Every Scale
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From one-time setups to fully managed enterprise solutions, we have a plan that fits your needs.
            </p>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-1 md:grid-cols-2 lg:max-w-5xl lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="bg-card/90 hover:bg-card transition-colors flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                  {service.icon}
                  <CardTitle className="font-headline">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <p className="text-muted-foreground">{service.description}</p>
                  <p className="text-2xl font-bold">{service.price}</p>
                </CardContent>
                 {service.link && (
                    <CardContent>
                      <Button asChild className="w-full">
                        <Link href={service.link}>Contact Sales</Link>
                      </Button>
                    </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="protocols" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Extensive Protocol Support
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We integrate with a growing ecosystem of leading blockchain networks.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {PROTOCOLS.slice(0, 8).map((protocol) => (
              <div key={protocol.name} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <protocol.icon className="h-6 w-6" />
                <span className="font-semibold">{protocol.name}</span>
              </div>
            ))}
          </div>
           <div className="text-center mt-12">
              <Button asChild>
                <Link href="/protocols">
                  View All Supported Protocols
                </Link>
              </Button>
            </div>
        </div>
      </section>

      <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center justify-center gap-8 px-4 md:px-6">
          <div className="space-y-4 text-center">
             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Contact Us
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Have questions about our services or need support? Drop us a line.
            </p>
          </div>
          <div className="mx-auto w-full max-w-lg">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
