import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showText?: boolean;
};

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-headline text-2xl font-bold",
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="VigiTracker Logo"
        width={32}
        height={32}
        priority
        className="rounded-md"
      />

      {showText && (
        <span className="text-foreground">VigiTracker</span>
      )}
    </Link>
  );
}
