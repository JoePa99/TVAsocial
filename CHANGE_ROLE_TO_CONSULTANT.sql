-- Change joe@upupdndn.ai from agency to consultant

UPDATE public.users
SET role = 'consultant'
WHERE email = 'joe@upupdndn.ai';

-- Verify the change
SELECT id, email, role, created_at
FROM public.users
WHERE email = 'joe@upupdndn.ai';
