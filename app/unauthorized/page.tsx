import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-editorial bg-noise flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-3">
          <h1 className="font-display text-display-md text-accent">403</h1>
          <h2 className="font-headline text-heading-xl text-foreground">
            Access Denied
          </h2>
          <p className="font-body text-body-lg text-foreground-muted">
            You don't have permission to access this page.
          </p>
        </div>

        <Link href="/" className="inline-block btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
