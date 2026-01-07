import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 font-headline text-2xl font-bold text-primary", className)}>
      <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
        <MapPin className="h-6 w-6" />
      </div>
      <span className="text-foreground">VigiTracker</span>
    </div>
  );
}
