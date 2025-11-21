-- Add consultant_id column to clients table
-- This links clients to the consultant who created them

ALTER TABLE public.clients
ADD COLUMN consultant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX idx_clients_consultant_id ON public.clients(consultant_id);

-- Backfill existing clients with the first consultant user (if any)
-- You can manually update these later to assign to the correct consultant
UPDATE public.clients
SET consultant_id = (
  SELECT id FROM public.users WHERE role = 'consultant' LIMIT 1
)
WHERE consultant_id IS NULL;
