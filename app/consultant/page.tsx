import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function ConsultantDashboard() {
  const user = await requireRole('consultant');
  const supabase = await createClient();

  // Get all clients and their strategies
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
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-editorial bg-noise">
      {/* Header */}
      <header className="border-b border-neutral-700 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-heading-xl bg-gradient-to-r from-purple to-orange bg-clip-text text-transparent">
                Consultant Dashboard
              </h1>
              <p className="font-body text-body-sm text-foreground-muted mt-1">
                Welcome back, {user.email}
              </p>
            </div>
            <Link href="/consultant/new-client" className="btn-primary">
              + New Client
            </Link>
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
                Total Clients
              </p>
              <p className="font-headline text-heading-xl text-foreground">
                {clients?.length || 0}
              </p>
            </div>
            <div className="card-editorial p-6 space-y-2">
              <p className="font-ui text-ui-md text-foreground-muted uppercase tracking-wide">
                Active Strategies
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
                Client Projects
              </h2>
            </div>

            {clients && clients.length > 0 ? (
              <div className="grid gap-6">
                {clients.map((client: any, index: number) => (
                  <Link
                    key={client.id}
                    href={`/consultant/${client.id}`}
                    className="card-editorial p-6 group hover:border-purple/50 transition-all duration-300 stagger-item"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-headline text-heading-md text-foreground group-hover:text-purple transition-colors">
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
                                className="px-3 py-1 bg-orange/10 text-orange font-ui text-ui-sm border border-orange/20"
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
                          View →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card-editorial p-12 text-center space-y-4">
                <div className="text-6xl">📋</div>
                <h3 className="font-headline text-heading-md text-foreground">
                  No clients yet
                </h3>
                <p className="font-body text-body-md text-foreground-muted max-w-md mx-auto">
                  Get started by creating your first client and uploading their company OS document
                  to generate a comprehensive social media strategy.
                </p>
                <Link href="/consultant/new-client" className="inline-block btn-primary mt-4">
                  Create First Client
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
