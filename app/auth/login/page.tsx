'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for error messages in URL
    const errorParam = searchParams.get('error');
    if (errorParam === 'account_setup') {
      setError('Your account setup is incomplete. Please contact support or sign up again.');
    } else if (errorParam === 'invalid_role') {
      setError('Your account role is invalid. Please contact support.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user || !data.session) throw new Error('Login failed');

      // Set session server-side to ensure middleware can see authenticated user
      await fetch('/api/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }),
      });

      // Get user role and redirect to their dashboard
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userData?.role) {
        window.location.href = `/${userData.role}`;
      } else {
        throw new Error('Could not determine user role');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-editorial bg-noise flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="font-display text-display-sm text-foreground mb-3">
            TVA<span className="bg-gradient-to-r from-purple to-orange bg-clip-text text-transparent">social</span>
          </h1>
          <p className="font-body text-body-md text-foreground-muted">
            Transform strategy into stories
          </p>
        </div>

        {/* Login Form */}
        <div className="card-editorial p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-headline text-heading-lg text-foreground">
              Welcome back
            </h2>
            <p className="font-body text-body-sm text-foreground-muted">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="p-4 bg-orange/10 border border-orange/20 animate-slide-down">
              <p className="font-ui text-ui-md text-orange">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block font-ui text-ui-md font-medium text-foreground"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-editorial"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block font-ui text-ui-md font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-editorial"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="section-divider !my-6" />

          <p className="font-body text-body-sm text-foreground-muted text-center">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-purple hover:text-purple-light font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center font-ui text-ui-sm text-foreground-subtle">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
