'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function DebugPage() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check auth user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          setError({ type: 'auth', message: authError.message });
          setLoading(false);
          return;
        }

        setAuthUser(user);

        if (!user) {
          setLoading(false);
          return;
        }

        // Try to get user from database
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (dbError) {
          setError({ type: 'database', message: dbError.message, code: dbError.code, details: dbError.details });
        } else {
          setDbUser(userData);
        }
      } catch (err: any) {
        setError({ type: 'exception', message: err.message });
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-editorial bg-noise p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card-editorial p-8 space-y-6">
          <h1 className="font-headline text-heading-xl text-foreground">
            Authentication Debug
          </h1>

          {loading && (
            <div className="p-4 bg-purple/10 border border-purple/20">
              <p className="font-ui text-ui-md text-purple">Loading...</p>
            </div>
          )}

          {/* Auth User */}
          <div className="space-y-2">
            <h2 className="font-headline text-heading-md text-foreground">
              Auth User (from auth.users)
            </h2>
            <div className="p-4 bg-background-subtle rounded font-mono text-sm">
              {authUser ? (
                <pre className="text-foreground whitespace-pre-wrap">
                  {JSON.stringify({
                    id: authUser.id,
                    email: authUser.email,
                    role_from_metadata: authUser.user_metadata?.role,
                    created_at: authUser.created_at,
                  }, null, 2)}
                </pre>
              ) : (
                <p className="text-foreground-muted">Not authenticated</p>
              )}
            </div>
          </div>

          {/* Database User */}
          <div className="space-y-2">
            <h2 className="font-headline text-heading-md text-foreground">
              Database User (from public.users)
            </h2>
            <div className="p-4 bg-background-subtle rounded font-mono text-sm">
              {dbUser ? (
                <pre className="text-foreground whitespace-pre-wrap">
                  {JSON.stringify(dbUser, null, 2)}
                </pre>
              ) : (
                <p className="text-foreground-muted">No database record found</p>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="space-y-2">
              <h2 className="font-headline text-heading-md text-orange">
                Error ({error.type})
              </h2>
              <div className="p-4 bg-orange/10 border border-orange/20 rounded font-mono text-sm">
                <pre className="text-orange whitespace-pre-wrap">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Diagnosis */}
          <div className="space-y-2 mt-8 p-4 bg-purple/10 border border-purple/20 rounded">
            <h2 className="font-headline text-heading-md text-foreground">
              Diagnosis
            </h2>
            <div className="font-body text-body-md text-foreground-muted space-y-2">
              {!authUser && <p>❌ Not signed in</p>}
              {authUser && !dbUser && !error && <p>❌ Signed in but no database profile (this is the problem!)</p>}
              {authUser && dbUser && <p>✅ Signed in with database profile - middleware should redirect you</p>}
              {error?.code === 'PGRST116' && <p>❌ RLS Policy blocking access - you can't read your own profile!</p>}
              {error?.code === '42P01' && <p>❌ Table doesn't exist</p>}
              {error && error.code && error.code !== 'PGRST116' && error.code !== '42P01' && (
                <p>❌ Database error: {error.code}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
