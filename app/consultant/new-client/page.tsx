'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';

export default function NewClientPage() {
  const router = useRouter();
  const [step, setStep] = useState<'info' | 'upload' | 'generating'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Client info
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');

  // Upload
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  const handleClientInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError('Client name is required');
      return;
    }
    setError('');
    setStep('upload');
  };

  const handleGenerateStrategy = async () => {
    if (!file) {
      setError('Please upload a company OS document');
      return;
    }

    setLoading(true);
    setError('');
    setStep('generating');

    try {
      // Create client
      const clientRes = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          company_name: companyName,
          industry,
        }),
      });

      if (!clientRes.ok) throw new Error('Failed to create client');
      const { data: client } = await clientRes.json();

      // Upload document
      const formData = new FormData();
      formData.append('file', file);
      formData.append('client_id', client.id);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Failed to upload document');
      const { url: documentUrl } = await uploadRes.json();

      // Generate strategy with AI
      setUploadProgress(50);
      const strategyRes = await fetch('/api/ai/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          document_url: documentUrl,
        }),
      });

      if (!strategyRes.ok) throw new Error('Failed to generate strategy');
      const { strategy } = await strategyRes.json();

      setUploadProgress(100);

      // Redirect to client page
      setTimeout(() => {
        router.push(`/consultant/${client.id}`);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-editorial bg-noise">
      {/* Header */}
      <header className="border-b border-neutral-700 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/consultant" className="inline-block mb-3 text-foreground-muted hover:text-foreground transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="font-display text-heading-xl bg-gradient-to-r from-purple to-orange bg-clip-text text-transparent">
            Create New Client
          </h1>
          <p className="font-body text-body-md text-foreground-muted mt-2">
            Upload a company OS document to generate a comprehensive social strategy
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {['Client Info', 'Upload Document', 'Generate Strategy'].map((label, index) => {
            const stepIndex = step === 'info' ? 0 : step === 'upload' ? 1 : 2;
            const isActive = index === stepIndex;
            const isComplete = index < stepIndex;

            return (
              <div key={label} className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-ui font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-purple text-white shadow-glow'
                        : isComplete
                        ? 'bg-success text-white'
                        : 'bg-neutral-700 text-neutral-400'
                    }`}
                  >
                    {isComplete ? '✓' : index + 1}
                  </div>
                  <span
                    className={`font-ui text-ui-md hidden md:block ${
                      isActive ? 'text-foreground font-medium' : 'text-foreground-muted'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 ${isComplete ? 'bg-success' : 'bg-neutral-700'}`} />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-orange/10 border border-orange/20 animate-slide-down">
            <p className="font-ui text-ui-md text-orange">{error}</p>
          </div>
        )}

        {/* Step 1: Client Info */}
        {step === 'info' && (
          <div className="card-editorial p-8 animate-fade-in">
            <h2 className="font-headline text-heading-lg text-foreground mb-6">
              Client Information
            </h2>

            <form onSubmit={handleClientInfoSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-ui text-ui-md font-medium text-foreground">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input-editorial"
                  placeholder="Acme Corporation"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-ui text-ui-md font-medium text-foreground">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input-editorial"
                  placeholder="Acme Corp Ltd."
                />
              </div>

              <div className="space-y-2">
                <label className="block font-ui text-ui-md font-medium text-foreground">
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="input-editorial"
                  placeholder="E-commerce, SaaS, Healthcare, etc."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Continue to Upload
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Upload Document */}
        {step === 'upload' && (
          <div className="card-editorial p-8 animate-fade-in">
            <h2 className="font-headline text-heading-lg text-foreground mb-6">
              Upload Company OS Document
            </h2>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-purple bg-purple/10 shadow-glow'
                  : file
                  ? 'border-success bg-success/10'
                  : 'border-neutral-700 hover:border-orange hover:shadow-orange-glow'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="text-6xl">
                  {file ? '✓' : '📄'}
                </div>
                {file ? (
                  <>
                    <p className="font-headline text-heading-sm text-success">
                      {file.name}
                    </p>
                    <p className="font-ui text-ui-sm text-foreground-subtle">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : isDragActive ? (
                  <p className="font-body text-body-lg text-purple">
                    Drop the file here...
                  </p>
                ) : (
                  <>
                    <p className="font-body text-body-lg text-foreground">
                      Drag & drop your company OS document here
                    </p>
                    <p className="font-ui text-ui-md text-foreground-muted">
                      or click to browse
                    </p>
                    <p className="font-ui text-ui-sm text-foreground-subtle">
                      Supports PDF, DOC, DOCX, TXT (max 50MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button
                onClick={() => setStep('info')}
                className="btn-secondary"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleGenerateStrategy}
                className="btn-primary"
                disabled={!file || loading}
              >
                Generate Strategy with AI
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {step === 'generating' && (
          <div className="card-editorial p-12 text-center animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple/10 rounded-full">
                <div className="w-10 h-10 border-4 border-purple/30 border-t-purple rounded-full animate-spin" />
              </div>

              <div className="space-y-2">
                <h2 className="font-headline text-heading-lg bg-gradient-to-r from-purple to-orange bg-clip-text text-transparent">
                  Generating Strategy...
                </h2>
                <p className="font-body text-body-md text-foreground-muted">
                  Our AI is analyzing your company OS and creating a comprehensive social media
                  strategy. This may take a minute.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="h-2 bg-neutral-700 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-purple to-orange transition-all duration-500 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="font-ui text-ui-sm text-foreground-subtle mt-2">
                  {uploadProgress}% complete
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
