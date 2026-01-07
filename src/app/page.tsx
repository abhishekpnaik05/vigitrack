'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ArrowRight, BarChart3, Globe, Siren, MapPin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const features = [
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Global Real-Time Tracking',
    description: 'Monitor your assets anywhere in the world with precise, up-to-the-second GPS location data. Our interactive maps provide a live view of your entire fleet.'
  },
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: 'Intelligent Geofencing',
    description: 'Create custom virtual boundaries and receive instant alerts when assets enter or exit designated zones. Perfect for security, logistics, and operational control.'
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Analytics',
    description: 'Turn data into decisions. Generate insightful reports on trip history, device uptime, and movement patterns with our advanced AI summarization and analysis tools.'
  },
  {
    icon: <Siren className="h-8 w-8 text-primary" />,
    title: 'Instant SOS Alerts',
    description: 'Enhance safety with a one-touch SOS button that immediately notifies emergency contacts with the user\'s exact location for a rapid response.'
  }
]

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      {...props}
      fill="currentColor"
    >
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 .9c61.4 0 111.4 49.9 111.4 111.4 0 29.5-11.5 56.4-30.5 76.5l-21.4 21.4-120.1-62.9-20.1-20.2c-19.4-20.1-31.4-47-31.4-76.5 0-61.5 50-111.4 111.5-111.4zm0 0" />
    </svg>
  );
}


export default function Home() {
  const router = useRouter();

  const handleWhatsAppClick = () => {
    const phoneNumber = '9740379711';
    const message = "Hello! I'm interested in VigiTracker.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto flex items-center justify-between p-4">
        <Logo />
        <Button variant="outline" onClick={() => router.push('/login')}>
          Sign In
        </Button>
      </header>
      <main className="flex-1">
        <section className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 text-center md:grid-cols-2 md:py-24 md:text-left">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
              Advanced GPS Tracking for Total Asset Control
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:mx-0 md:text-xl">
              VigiTracker offers a real-time, intelligent solution to monitor
              your fleet, protect your assets, and optimize your operations with
              powerful analytics and AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                className="group"
                onClick={() => router.push('/signup')}
              >
                Get Started Free
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWhatsAppClick}
                className="bg-green-500 hover:bg-green-600 text-white hover:text-white"
              >
                <WhatsAppIcon className="h-5 w-5 mr-2" />
                Contact on WhatsApp
              </Button>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-2xl md:h-auto md:aspect-square">
            <Image
              src="https://picsum.photos/seed/globe/800/800"
              alt="Globe showing GPS tracks"
              fill
              className="object-cover"
              data-ai-hint="globe map"
            />
          </div>
        </section>

        <section id="features" className="bg-secondary/50 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">The Ultimate Fleet Management Platform</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        From live vehicle tracking to AI-powered reports, VigiTracker provides everything you need to
                        gain complete visibility and control over your valuable assets.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <Card key={feature.title} className="text-center">
                            <CardHeader className="items-center">
                                <div className="rounded-full bg-primary/10 p-4">
                                    {feature.icon}
                                </div>
                                <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
            <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-2xl md:h-auto md:aspect-square">
                <Image
                src="https://picsum.photos/seed/gpstracker/800/800"
                alt="GPS tracker device"
                fill
                className="object-cover"
                data-ai-hint="gps tracker"
                />
            </div>
            <div className="space-y-4">
                <h3 className="font-headline text-3xl font-bold tracking-tighter">Powerful Hardware Integration</h3>
                <p className="text-muted-foreground md:text-lg">
                    VigiTracker supports a wide range of GPS devices. Our platform is built to be hardware-agnostic,
                    allowing you to bring your own devices or choose from our list of recommended trackers.
                    Manage firmware, monitor device status, and ensure your fleet is always connected.
                </p>
                <Button
                variant="outline"
                className="group"
                onClick={() => router.push('/devices')}
                >
                Manage Your Devices
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </section>
      </main>
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground">
                Advanced GPS tracking and fleet management for total asset control.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <ul className="space-y-1 text-sm">
                <li><Link href="#features" className="text-muted-foreground hover:text-primary">Features</Link></li>
                <li><Link href="/signup" className="text-muted-foreground hover:text-primary">Sign Up</Link></li>
                <li><Link href="/login" className="text-muted-foreground hover:text-primary">Login</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Contact Us</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href="mailto:abhishekpnaik09@gmail.com" className="text-muted-foreground hover:text-primary">
                    abhishekpnaik09@gmail.com
                  </a>
                </li>
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href="tel:+919740379711" className="text-muted-foreground hover:text-primary">
                    +91 9740379711
                  </a>
                </li>
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <WhatsAppIcon className="h-4 w-4 text-muted-foreground" />
                  <button onClick={handleWhatsAppClick} className="text-muted-foreground hover:text-primary">
                    WhatsApp
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} VigiTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
