'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        // If user has a role, redirect them to their dashboard
        if (dbUser?.role) {
          router.replace(`/${dbUser.role}`);
          return;
        }
      }

      // Not authenticated or no role, show homepage
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-editorial bg-noise flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-purple/30 border-t-purple rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-editorial bg-noise">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24">
          <h1 className="font-display text-display-md md:text-display-lg text-foreground text-balance">
            Transform Strategy
            <br />
            <span className="bg-gradient-to-r from-purple to-orange bg-clip-text text-transparent">
              Into Stories
            </span>
          </h1>
          <p className="font-body text-body-lg text-foreground-muted max-w-2xl mx-auto text-pretty">
            From 90-page company documents to strategic social media calendars.
            AI-powered content generation for consultants, agencies, and clients.
          </p>
          <div className="flex gap-4 justify-center items-center">
            <Link href="/auth/signup" className="btn-primary">
              Get Started
            </Link>
            <Link href="/auth/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Consultant Backend",
              description: "Upload company OS documents and generate comprehensive social strategies with AI.",
              icon: "📊",
              accent: "purple",
            },
            {
              title: "Agency Portal",
              description: "Refine content, collaborate with clients, and manage multiple campaigns effortlessly.",
              icon: "✨",
              accent: "orange",
            },
            {
              title: "Client Approval",
              description: "Beautiful monthly views with strategic context for easy review and approval.",
              icon: "✓",
              accent: "purple",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="card-editorial p-8 space-y-4 stagger-item group"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className={`font-headline text-heading-md text-foreground group-hover:text-${feature.accent} transition-colors`}>
                {feature.title}
              </h3>
              <p className="font-body text-body-md text-foreground-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="section-divider" />

        {/* Value Proposition */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-headline text-heading-xl text-foreground">
            Three tiers. One powerful platform.
          </h2>
          <p className="font-body text-body-lg text-foreground-muted text-pretty">
            Built for the modern content workflow. From strategy to execution,
            TVAsocial transforms how agencies create and manage social media content.
          </p>
        </div>
      </div>
    </main>
  );
}
