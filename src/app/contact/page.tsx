import ContactForm from '@/components/forms/contact-form';

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 md:py-24">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Get in Touch
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Have a question or want to work together? Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
