import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-editorial bg-noise">
      <div className="max-w-7xl mx-auto px-6 py-24">
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

          {/* Quick dashboard links */}
          <div className="pt-8 flex gap-4 justify-center items-center text-sm">
            <Link href="/consultant" className="text-purple hover:underline">
              Consultant Dashboard →
            </Link>
            <Link href="/agency" className="text-orange hover:underline">
              Agency Dashboard →
            </Link>
            <Link href="/client" className="text-purple hover:underline">
              Client Dashboard →
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
