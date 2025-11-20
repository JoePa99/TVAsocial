-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('consultant', 'agency', 'client');
CREATE TYPE post_status AS ENUM ('draft', 'agency_review', 'client_review', 'approved');
CREATE TYPE post_type AS ENUM ('Reel', 'Carousel', 'Story', 'Static', 'Video');
CREATE TYPE platform AS ENUM ('Instagram', 'YouTube', 'TikTok', 'LinkedIn', 'Twitter', 'Facebook');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL,
  assigned_clients UUID[], -- For agency users
  client_id UUID, -- For client users
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company_name TEXT,
  industry TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Strategies table
CREATE TABLE public.strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  platforms platform[] NOT NULL DEFAULT '{}',
  content_pillars TEXT[] NOT NULL DEFAULT '{}',
  kpis TEXT[] NOT NULL DEFAULT '{}',
  monthly_themes JSONB NOT NULL DEFAULT '{}',
  company_os_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Series table
CREATE TABLE public.series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES public.strategies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  goal TEXT NOT NULL,
  cadence TEXT NOT NULL,
  platforms platform[] NOT NULL DEFAULT '{}',
  tone TEXT NOT NULL,
  examples JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES public.strategies(id) ON DELETE CASCADE,
  series_id UUID REFERENCES public.series(id) ON DELETE SET NULL,
  month TEXT NOT NULL,
  week INTEGER NOT NULL,
  post_date DATE NOT NULL,
  platform platform[] NOT NULL DEFAULT '{}',
  post_type post_type NOT NULL,
  hook TEXT NOT NULL,
  body_copy TEXT NOT NULL,
  cta TEXT NOT NULL,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  justification TEXT NOT NULL,
  wildcard BOOLEAN NOT NULL DEFAULT FALSE,
  visual_concept TEXT NOT NULL,
  image_url TEXT,
  status post_status NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_strategies_client_id ON public.strategies(client_id);
CREATE INDEX idx_series_strategy_id ON public.series(strategy_id);
CREATE INDEX idx_posts_strategy_id ON public.posts(strategy_id);
CREATE INDEX idx_posts_series_id ON public.posts(series_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_post_date ON public.posts(post_date);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_users_client_id ON public.users(client_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategies_updated_at BEFORE UPDATE ON public.strategies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_series_updated_at BEFORE UPDATE ON public.series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for Clients
CREATE POLICY "Consultants can view all clients"
  ON public.clients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'consultant'
    )
  );

CREATE POLICY "Agencies can view assigned clients"
  ON public.clients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'agency'
      AND id = ANY(users.assigned_clients)
    )
  );

CREATE POLICY "Clients can view their own info"
  ON public.clients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'client'
      AND users.client_id = clients.id
    )
  );

-- RLS Policies for Strategies
CREATE POLICY "Consultants can view all strategies"
  ON public.strategies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'consultant'
    )
  );

CREATE POLICY "Consultants can insert strategies"
  ON public.strategies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'consultant'
    )
  );

CREATE POLICY "Consultants can update strategies"
  ON public.strategies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'consultant'
    )
  );

CREATE POLICY "Agencies can view assigned client strategies"
  ON public.strategies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'agency'
      AND client_id = ANY(users.assigned_clients)
    )
  );

CREATE POLICY "Clients can view their own strategies"
  ON public.strategies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'client'
      AND users.client_id = client_id
    )
  );

-- RLS Policies for Series
CREATE POLICY "Consultants can manage all series"
  ON public.series FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'consultant'
    )
  );

CREATE POLICY "Agencies can view series for assigned clients"
  ON public.series FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.strategies s
      INNER JOIN public.users u ON u.id = auth.uid()
      WHERE s.id = series.strategy_id
      AND u.role = 'agency'
      AND s.client_id = ANY(u.assigned_clients)
    )
  );

CREATE POLICY "Clients can view their own series"
  ON public.series FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.strategies s
      INNER JOIN public.users u ON u.id = auth.uid()
      WHERE s.id = series.strategy_id
      AND u.role = 'client'
      AND u.client_id = s.client_id
    )
  );

-- RLS Policies for Posts
CREATE POLICY "Consultants can manage all posts"
  ON public.posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'consultant'
    )
  );

CREATE POLICY "Agencies can view posts for assigned clients"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.strategies s
      INNER JOIN public.users u ON u.id = auth.uid()
      WHERE s.id = posts.strategy_id
      AND u.role = 'agency'
      AND s.client_id = ANY(u.assigned_clients)
    )
  );

CREATE POLICY "Agencies can update posts for assigned clients"
  ON public.posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.strategies s
      INNER JOIN public.users u ON u.id = auth.uid()
      WHERE s.id = posts.strategy_id
      AND u.role = 'agency'
      AND s.client_id = ANY(u.assigned_clients)
    )
  );

CREATE POLICY "Clients can view their own posts"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.strategies s
      INNER JOIN public.users u ON u.id = auth.uid()
      WHERE s.id = posts.strategy_id
      AND u.role = 'client'
      AND u.client_id = s.client_id
    )
  );

CREATE POLICY "Clients can update post status (approve)"
  ON public.posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.strategies s
      INNER JOIN public.users u ON u.id = auth.uid()
      WHERE s.id = posts.strategy_id
      AND u.role = 'client'
      AND u.client_id = s.client_id
    )
  );

-- RLS Policies for Comments
CREATE POLICY "Users can view comments on posts they can access"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = comments.post_id
      -- User can see the post (handled by posts RLS)
    )
  );

CREATE POLICY "Users can insert comments on posts they can access"
  ON public.comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = post_id
      -- User can see the post (handled by posts RLS)
    )
    AND auth.uid() = user_id
  );

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Storage policies for documents
CREATE POLICY "Consultants can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'consultant'
    )
  );

CREATE POLICY "Users can view documents for their clients"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (
      -- Consultants can see all
      EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid() AND users.role = 'consultant'
      )
      -- Agencies can see assigned clients
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'agency'
        AND (storage.foldername(name))[1]::uuid = ANY(users.assigned_clients)
      )
      -- Clients can see their own
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'client'
        AND (storage.foldername(name))[1]::uuid = users.client_id
      )
    )
  );

-- Storage policies for images (public read)
CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
  );
