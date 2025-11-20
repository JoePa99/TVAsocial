# Vercel Deployment Guide

## Required Environment Variables

Add these to your Vercel project settings under **Settings → Environment Variables**.

### 1. Supabase Configuration (Required)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings → API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 2. Anthropic Claude API (Required)

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

**Where to get this:**
1. Go to https://console.anthropic.com
2. Navigate to **API Keys**
3. Create a new key or copy an existing one

### 3. Image Generation (Choose One)

#### Option A: Google Cloud Vertex AI / Imagen (Recommended if you want Google)

```env
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"..."}
```

**Setup steps:**
1. Create a Google Cloud project at https://console.cloud.google.com
2. Enable the **Vertex AI API**
3. Create a service account:
   - Go to **IAM & Admin → Service Accounts**
   - Click **Create Service Account**
   - Grant role: **Vertex AI User**
4. Create a key (JSON format)
5. Copy the entire JSON content to `GOOGLE_APPLICATION_CREDENTIALS_JSON`
6. Copy your project ID to `GOOGLE_CLOUD_PROJECT_ID`

**Note:** For Vercel, you need to paste the entire JSON as a string (minified, no line breaks).

#### Option B: OpenAI DALL-E

```env
OPENAI_API_KEY=sk-xxxxx
```

**Where to get this:**
1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy the key

#### Option C: Midjourney (via third-party API)

```env
MIDJOURNEY_API_KEY=your_midjourney_api_key
```

Midjourney doesn't have an official API yet. You'd need to use a third-party service like:
- https://thenextleg.io
- https://midjourneyapi.io

---

## Vercel Deployment Steps

### 1. Push to GitHub

Make sure all your code is on the `main` branch:

```bash
git add .
git commit -m "Update environment configuration"
git push origin main
```

### 2. Connect to Vercel

1. Go to https://vercel.com
2. Click **Add New... → Project**
3. Import your GitHub repository: `JoePa99/TVAsocial`
4. Vercel will auto-detect Next.js

### 3. Configure Build Settings

**Framework Preset:** Next.js (auto-detected)
**Build Command:** `npm run build`
**Output Directory:** `.next` (auto-detected)
**Install Command:** `npm install`

### 4. Add Environment Variables

In the deployment configuration screen, add all the environment variables listed above:

**Important:**
- Mark variables starting with `NEXT_PUBLIC_` as **Production, Preview, and Development**
- Mark secret variables (API keys, service role key) as **Production and Preview only**

### 5. Deploy

Click **Deploy** and wait for the build to complete.

---

## Post-Deployment Configuration

### 1. Update Supabase Allowed Origins

1. Go to your Supabase dashboard
2. Navigate to **Authentication → URL Configuration**
3. Add your Vercel URLs to **Site URL** and **Redirect URLs**:
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/auth/callback
   ```

### 2. Set Custom Domain (Optional)

1. In Vercel, go to **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update Supabase URLs accordingly

---

## Environment Variables Summary

### Minimum Required (6 variables):

```env
# Supabase (3 variables)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# AI (1 variable)
ANTHROPIC_API_KEY

# Image Generation - Choose One (1-2 variables)
# Option A: Google
GOOGLE_CLOUD_PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS_JSON

# Option B: OpenAI
OPENAI_API_KEY

# Option C: Midjourney
MIDJOURNEY_API_KEY
```

---

## Troubleshooting

### Build Fails

**Issue:** Missing environment variables
**Solution:** Check that all required variables are added in Vercel settings

**Issue:** TypeScript errors
**Solution:** Run `npm run build` locally first to catch errors

### Runtime Errors

**Issue:** "supabaseUrl is required"
**Solution:** Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly

**Issue:** Authentication fails
**Solution:**
1. Check Supabase allowed origins
2. Verify anon key is correct
3. Check that redirect URLs are configured

**Issue:** AI generation fails
**Solution:**
1. Verify API keys are correct
2. Check API quota/billing
3. Review API error logs in Vercel

### Database Connection Issues

**Issue:** "Failed to fetch" or connection timeouts
**Solution:**
1. Check Supabase project is active
2. Verify RLS policies are correct
3. Check Supabase logs in dashboard

---

## Monitoring & Logs

### View Logs

1. Go to your Vercel project
2. Navigate to **Deployments**
3. Click on a deployment
4. View **Runtime Logs** or **Build Logs**

### Check Performance

1. Navigate to **Analytics**
2. Review page load times and errors
3. Check **Speed Insights** for optimization tips

---

## Security Checklist

Before deploying to production:

- [ ] All secret keys are kept private (not in public repos)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is only in Vercel environment variables
- [ ] Supabase RLS policies are enabled and tested
- [ ] Allowed origins are configured in Supabase
- [ ] API keys have appropriate rate limits set
- [ ] Environment variables are scoped correctly (Production vs Preview)

---

## Cost Estimates

### Vercel
- **Hobby plan:** Free for personal projects
- **Pro plan:** $20/month (recommended for production)

### Supabase
- **Free tier:** 500MB database, 1GB file storage
- **Pro tier:** $25/month (recommended for production)

### Anthropic Claude
- **Pay-as-you-go:** ~$0.008 per 1K input tokens
- Budget for ~$50-200/month depending on usage

### Image Generation
- **Google Vertex AI:** ~$0.020 per image
- **OpenAI DALL-E 3:** $0.040-0.080 per image
- Budget for ~$20-100/month depending on volume

---

## Next Steps After Deployment

1. Test authentication flow
2. Create a test client and strategy
3. Verify AI generation works
4. Test file uploads to Supabase Storage
5. Monitor error logs for the first 24 hours
6. Set up custom domain (if desired)
7. Configure production monitoring (Sentry, LogRocket, etc.)

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Anthropic Docs:** https://docs.anthropic.com
- **Google Cloud Vertex AI:** https://cloud.google.com/vertex-ai/docs

---

**Questions?** Check the main README.md or Supabase setup guide in `/supabase/README.md`.
