import { createClient } from '@/lib/supabase/server';

export default async function AgencyTestPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  const { data: dbUser, error: dbError } = user ? await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single() : { data: null, error: null };

  return (
    <div className="min-h-screen bg-gradient-editorial bg-noise p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card-editorial p-8 space-y-6">
          <h1 className="font-headline text-heading-xl text-foreground">
            Agency Dashboard (Test)
          </h1>

          <div className="space-y-4">
            <div className="p-4 bg-background-subtle rounded">
              <h2 className="font-headline text-heading-md text-foreground mb-2">Auth Status</h2>
              <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">
                {authError ? `Error: ${authError.message}` : `✅ Authenticated as ${user?.email}`}
              </pre>
            </div>

            <div className="p-4 bg-background-subtle rounded">
              <h2 className="font-headline text-heading-md text-foreground mb-2">Database Profile</h2>
              <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">
                {dbError ? `Error: ${dbError.message}` : JSON.stringify(dbUser, null, 2)}
              </pre>
            </div>

            {dbUser && dbUser.role === 'agency' && (
              <div className="p-4 bg-purple/10 border border-purple/20 rounded">
                <p className="font-ui text-ui-md text-purple">
                  ✅ You have agency role! This page loaded successfully!
                </p>
              </div>
            )}

            {dbUser && dbUser.role !== 'agency' && (
              <div className="p-4 bg-orange/10 border border-orange/20 rounded">
                <p className="font-ui text-ui-md text-orange">
                  ❌ Your role is "{dbUser.role}", not "agency"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
