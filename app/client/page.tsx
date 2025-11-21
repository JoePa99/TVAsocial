import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ClientDashboard() {
  const user = await getCurrentUser();

  // If no user, redirect to login
  if (!user) {
    redirect('/auth/login');
  }

  // If wrong role, redirect to homepage (homepage will redirect to correct dashboard)
  if (user.role !== 'client') {
    redirect('/');
  }

  const supabase = await createClient();

  // Get the client's own data and strategies
  const { data: clientData } = await supabase
    .from('clients')
    .select(`
      *,
      strategies (
        id,
        created_at,
        platforms,
        content_pillars
      )
    `)
    .eq('id', user.client_id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-editorial bg-noise">
      {/* Header */}
      <header className="border-b border-neutral-700 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="inline-block mb-2">
                <span className="font-display text-body-lg text-foreground hover:opacity-70 transition-opacity">
                  TVA<span className="bg-gradient-to-r from-purple to-orange bg-clip-text text-transparent">social</span>
                </span>
              </Link>
              <h1 className="font-display text-heading-xl bg-gradient-to-r from-purple to-orange bg-clip-text text-transparent">
                Client Dashboard
              </h1>
              <p className="font-body text-body-sm text-foreground-muted mt-1">
                Welcome back, {user.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {clientData ? (
            <>
              {/* Company Info Card */}
              <div className="card-editorial p-8 space-y-4">
                <h2 className="font-headline text-heading-lg text-foreground">
                  {clientData.name}
                </h2>
                {clientData.company_name && (
                  <p className="font-ui text-ui-lg text-foreground-muted">
                    {clientData.company_name}
                  </p>
                )}
              </div>

              {/* Stats Overview */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="card-editorial p-6 space-y-2">
                  <p className="font-ui text-ui-md text-foreground-muted uppercase tracking-wide">
                    Active Platforms
                  </p>
                  <p className="font-headline text-heading-xl text-foreground">
                    {clientData.strategies?.[0]?.platforms?.length || 0}
                  </p>
                </div>
                <div className="card-editorial p-6 space-y-2">
                  <p className="font-ui text-ui-md text-foreground-muted uppercase tracking-wide">
                    Content Pillars
                  </p>
                  <p className="font-headline text-heading-xl text-foreground">
                    {clientData.strategies?.[0]?.content_pillars?.length || 0}
                  </p>
                </div>
                <div className="card-editorial p-6 space-y-2">
                  <p className="font-ui text-ui-md text-foreground-muted uppercase tracking-wide">
                    This Month
                  </p>
                  <p className="font-headline text-heading-xl text-foreground">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="section-divider" />

              {/* Strategy Section */}
              {clientData.strategies && clientData.strategies.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="font-headline text-heading-lg text-foreground">
                    Your Social Media Strategy
                  </h2>

                  <div className="card-editorial p-8 space-y-6">
                    <div>
                      <h3 className="font-headline text-heading-md text-foreground mb-4">
                        Active Platforms
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {clientData.strategies[0].platforms?.map((platform: string) => (
                          <span
                            key={platform}
                            className="px-4 py-2 bg-purple/10 text-purple font-ui text-ui-md border border-purple/20"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>

                    {clientData.strategies[0].content_pillars && (
                      <div>
                        <h3 className="font-headline text-heading-md text-foreground mb-4">
                          Content Pillars
                        </h3>
                        <div className="grid gap-3">
                          {clientData.strategies[0].content_pillars.map((pillar: string, index: number) => (
                            <div
                              key={index}
                              className="p-4 bg-orange/5 border border-orange/20 font-body text-body-md text-foreground"
                            >
                              {pillar}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <Link
                        href={`/client/${clientData.id}/calendar`}
                        className="btn-primary"
                      >
                        View Content Calendar →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-editorial p-12 text-center space-y-4">
                  <div className="text-6xl">📅</div>
                  <h3 className="font-headline text-heading-md text-foreground">
                    Strategy in Progress
                  </h3>
                  <p className="font-body text-body-md text-foreground-muted max-w-md mx-auto">
                    Your consultant is working on creating your social media strategy.
                    You'll be able to review and approve content here once it's ready.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="card-editorial p-12 text-center space-y-4">
              <div className="text-6xl">👤</div>
              <h3 className="font-headline text-heading-md text-foreground">
                Account Setup in Progress
              </h3>
              <p className="font-body text-body-md text-foreground-muted max-w-md mx-auto">
                Your account is being set up. Please contact your consultant if you have any questions.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
