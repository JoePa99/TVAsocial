'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { UserRole } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('agency');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create auth user with role in metadata
      // The database trigger will automatically create the user profile
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Wait a brief moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use hard redirect to bypass any middleware issues
      if (role === 'consultant') {
        window.location.href = '/consultant';
      } else if (role === 'agency') {
        window.location.href = '/agency';
      } else if (role === 'client') {
        window.location.href = '/client';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-editorial bg-noise flex items-center justify-center px-6 py-12">
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

        {/* Signup Form */}
        <div className="card-editorial p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-headline text-heading-lg text-foreground">
              Create account
            </h2>
            <p className="font-body text-body-sm text-foreground-muted">
              Get started with your social media content strategy
            </p>
          </div>

          {error && (
            <div className="p-4 bg-orange/10 border border-orange/20 animate-slide-down">
              <p className="font-ui text-ui-md text-orange">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
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
                minLength={6}
              />
              <p className="font-ui text-ui-sm text-foreground-subtle">
                Must be at least 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="role"
                className="block font-ui text-ui-md font-medium text-foreground"
              >
                Account type
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="input-editorial"
                disabled={loading}
              >
                <option value="agency">Agency</option>
                <option value="client">Client</option>
                <option value="consultant">Consultant</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="section-divider !my-6" />

          <p className="font-body text-body-sm text-foreground-muted text-center">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-purple hover:text-purple-light font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center font-ui text-ui-sm text-foreground-subtle">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
