import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AgencyDashboard() {
  const user = await getCurrentUser();

  // If no user, show message
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-editorial bg-noise flex items-center justify-center p-6">
        <div className="card-editorial p-8 max-w-md text-center">
          <h2 className="font-headline text-heading-lg text-foreground mb-4">Please sign in</h2>
          <Link href="/auth/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();

  // Get assigned clients for this agency
  const { data: clients } = await supabase
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
    .contains('assigned_agencies', [user.id])
    .order('created_at', { ascending: false });

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
                Agency Dashboard
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
          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-editorial p-6 space-y-2">
              <p className="font-ui text-ui-md text-foreground-muted uppercase tracking-wide">
                Assigned Clients
              </p>
              <p className="font-headline text-heading-xl text-foreground">
                {clients?.length || 0}
              </p>
            </div>
            <div className="card-editorial p-6 space-y-2">
              <p className="font-ui text-ui-md text-foreground-muted uppercase tracking-wide">
                Active Campaigns
              </p>
              <p className="font-headline text-heading-xl text-foreground">
                {clients?.filter(c => c.strategies && c.strategies.length > 0).length || 0}
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

          {/* Clients List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-heading-lg text-foreground">
                Your Clients
              </h2>
            </div>

            {clients && clients.length > 0 ? (
              <div className="grid gap-6">
                {clients.map((client: any, index: number) => (
                  <Link
                    key={client.id}
                    href={`/agency/${client.id}`}
                    className="card-editorial p-6 group hover:border-orange/50 transition-all duration-300 stagger-item"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-headline text-heading-md text-foreground group-hover:text-orange transition-colors">
                            {client.name}
                          </h3>
                          {client.company_name && (
                            <p className="font-ui text-ui-md text-foreground-muted mt-1">
                              {client.company_name}
                            </p>
                          )}
                        </div>

                        {client.strategies && client.strategies.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {client.strategies[0].platforms?.map((platform: string) => (
                              <span
                                key={platform}
                                className="px-3 py-1 bg-purple/10 text-purple font-ui text-ui-sm border border-purple/20"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="font-ui text-ui-md text-foreground-subtle italic">
                            No strategy created yet
                          </p>
                        )}
                      </div>

                      <div className="text-right space-y-1">
                        <p className="font-ui text-ui-sm text-foreground-subtle">
                          {new Date(client.created_at).toLocaleDateString()}
                        </p>
                        <span className="inline-flex items-center text-orange font-ui text-ui-sm font-medium group-hover:translate-x-1 transition-transform">
                          Manage →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card-editorial p-12 text-center space-y-4">
                <div className="text-6xl">✨</div>
                <h3 className="font-headline text-heading-md text-foreground">
                  No clients assigned yet
                </h3>
                <p className="font-body text-body-md text-foreground-muted max-w-md mx-auto">
                  You'll see your assigned clients here once a consultant assigns them to you.
                  You can then refine content, collaborate, and manage campaigns.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
