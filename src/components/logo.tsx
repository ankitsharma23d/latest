import Link from 'next/link';
import { Blocks } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  isLink?: boolean;
};

const Logo = ({ className, isLink = true }: LogoProps) => {
  const content = (
    <>
      <Blocks className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tight">
        InfraSage
      </span>
    </>
  );

  const containerClassName = cn('flex items-center gap-2', className);

  if (isLink) {
    return (
      <Link href="/" className={containerClassName}>
        {content}
      </Link>
    );
  }

  return <div className={containerClassName}>{content}</div>;
};

export default Logo;
