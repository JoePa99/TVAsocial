'use client';

import { useState } from 'react';

export default function FixUsersPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFix = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/fix-users', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix users');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-editorial bg-noise flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="card-editorial p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-headline text-heading-lg text-foreground">
              Fix User Accounts
            </h2>
            <p className="font-body text-body-sm text-foreground-muted">
              This will create user profiles for any accounts that are stuck in auth.users but missing from public.users.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-orange/10 border border-orange/20">
              <p className="font-ui text-ui-md text-orange">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-purple/10 border border-purple/20">
              <p className="font-ui text-ui-md text-purple font-semibold mb-2">
                {result.message}
              </p>
              {result.users && result.users.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-ui text-ui-sm text-foreground-muted">
                    Fixed accounts:
                  </p>
                  {result.users.map((user: any, index: number) => (
                    <div key={index} className="font-body text-body-sm text-foreground">
                      • {user.email} ({user.role})
                    </div>
                  ))}
                </div>
              )}
              <p className="font-body text-body-sm text-purple-light mt-4">
                ✅ You can now sign in and will be redirected to your dashboard!
              </p>
            </div>
          )}

          <button
            onClick={handleFix}
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Fixing accounts...
              </span>
            ) : (
              'Fix My Account'
            )}
          </button>

          <div className="section-divider !my-6" />

          <div className="space-y-2">
            <p className="font-ui text-ui-sm font-semibold text-foreground">
              Alternative: Use Supabase Dashboard
            </p>
            <ol className="font-body text-body-sm text-foreground-muted space-y-1 list-decimal list-inside">
              <li>Go to your Supabase project dashboard</li>
              <li>Navigate to SQL Editor</li>
              <li>Copy and paste the contents of <code className="bg-background-subtle px-1 py-0.5 rounded">FIX_EXISTING_ACCOUNT.sql</code></li>
              <li>Click Run</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
