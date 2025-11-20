# TVAsocial - Social Media Content Management System

A three-tier social media content management platform that transforms company OS documents into strategic social media content calendars using AI.

## 🎯 Project Overview

TVAsocial enables consultants to generate AI-powered content strategies, agencies to refine and collaborate on content, and clients to review and approve in a visually stunning interface.

### Three-Tier Architecture

1. **Consultant Backend** - Upload company OS documents, generate AI strategies, create content
2. **Agency Portal** - Refine content, collaborate with clients, manage campaigns
3. **Client Portal** - Review content, approve posts, provide feedback

## ✨ Features Implemented

### Phase 1: Core Infrastructure ✅
- [x] Next.js 14 with TypeScript and App Router
- [x] Tailwind CSS with distinctive design system
- [x] Supabase integration (database, auth, storage)
- [x] Comprehensive database schema with RLS policies
- [x] Role-based authentication (consultant, agency, client)

### Phase 2: Consultant Workflow ⏳
- [x] Consultant dashboard
- [x] Client creation interface
- [x] Document upload system
- [x] AI strategy generation API
- [ ] Content generation interface
- [ ] Strategy review/edit interface

### Phases 3-5: Coming Next
- [ ] Agency Portal
- [ ] Client Portal
- [ ] Real-time collaboration
- [ ] Advanced AI refinement tools

## 🎨 Design System

Our editorial-inspired design system features:

- **Typography**: Fraunces (display), Sora (headline), Work Sans (body), Outfit (UI)
- **Colors**: Editorial boldness with red accent, warm neutrals
- **Aesthetics**: Magazine-style layouts, not generic SaaS
- **Animations**: Meaningful transitions, stagger effects, progressive disclosure

### Key Anti-Patterns Avoided
❌ Purple gradients on white
❌ Generic fonts (Inter, Roboto)
❌ Predictable sidebar layouts
❌ Rounded rectangle cards everywhere

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Anthropic API key (for Claude)

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

3. **Set up Supabase database**

   See [supabase/README.md](./supabase/README.md) for detailed setup instructions.

   Quick setup:
   - Go to your Supabase SQL Editor
   - Copy and paste `supabase/migrations/001_initial_schema.sql`
   - Run the migration

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
/app
  /api
    /ai
      /strategy         # AI strategy generation
    /clients            # Client management
    /upload             # Document uploads
  /auth
    /login              # Login page
    /signup             # Signup page
  /consultant           # Consultant dashboard & workflows
    /new-client         # New client creation flow
  /agency               # Agency portal (coming soon)
  /client               # Client portal (coming soon)
/components
  /ui                   # Base UI components (coming soon)
/lib
  /supabase             # Supabase client configs
  /ai                   # AI prompts and utilities
  /auth.ts              # Auth helper functions
/types
  /index.ts             # TypeScript type definitions
/supabase
  /migrations           # Database migrations
```

## 🗄️ Database Schema

### Core Tables
- **users** - Extended user profiles with roles
- **clients** - Client organizations
- **strategies** - Social media strategies per client
- **series** - Recurring content series/themes
- **posts** - Individual social media posts
- **comments** - Collaboration comments

### Security
All tables use Row Level Security (RLS):
- Consultants: Full access
- Agencies: Assigned clients only
- Clients: Own data only

## 🤖 AI Integration

### Powered by Anthropic Claude

1. **Strategy Generation**
   - Analyzes company OS documents
   - Recommends platforms, content pillars, KPIs
   - Creates recurring content series
   - Defines monthly themes

2. **Content Generation** (Coming Soon)
   - Generates 20-30 posts per month
   - Organizes by series
   - Includes hooks, copy, CTAs, hashtags
   - Provides strategic justification

3. **Refinement Tools** (Coming Soon)
   - Hook rewriting
   - Tone adjustment
   - Generate similar content

### Powered by Google Gemini

4. **Image Generation** ✅
   - Uses Gemini 2.0 Flash for fast, affordable image generation
   - Generates detailed image prompts from visual concepts
   - Incorporates brand colors and tone
   - 1,500 free images/day on free tier

## 🔐 Authentication & Authorization

### User Roles
- **Consultant**: Full system access, creates strategies
- **Agency**: Refines content for assigned clients
- **Client**: Reviews and approves own content

### Protected Routes
Middleware enforces role-based access:
- `/consultant/*` - Consultants only
- `/agency/*` - Agencies only
- `/client/*` - Clients only

## 🎯 Current Status

### What Works Now
✅ Complete authentication system
✅ Consultant dashboard
✅ Client creation workflow
✅ Document upload to Supabase Storage
✅ AI strategy generation with Claude
✅ Database with RLS policies

### Next Steps
🚧 Content generation interface
🚧 Strategy review/edit UI
🚧 Agency portal with calendar view
🚧 Client approval interface
🚧 Real-time collaboration

## 🛠️ Development

### Build for production
```bash
npm run build
```

### Run linter
```bash
npm run lint
```

### Type checking
```bash
npx tsc --noEmit
```

## 📝 API Routes

### `/api/clients`
- `GET` - List all clients (consultant only)
- `POST` - Create new client (consultant only)

### `/api/upload`
- `POST` - Upload company OS document

### `/api/ai/strategy`
- `POST` - Generate AI strategy from document

### Coming Soon
- `/api/ai/content` - Generate content for a month
- `/api/ai/refine` - Refine hooks and copy
- `/api/ai/image` - Generate image prompts

## 🎨 Design Philosophy

**Editorial Boldness**
- Think Vogue, NY Times - not generic SaaS
- Strong typography hierarchy
- Bold accent colors
- Magazine-style layouts
- Meaningful animations

**Content-First**
- Social media content is the star
- Progressive disclosure for details
- Beautiful, scannable layouts
- Visual hierarchy that guides the eye

## 🤝 Contributing

This is a custom build for TVAsocial. For questions or issues:
1. Review this README and `/supabase/README.md`
2. Check the build specification document
3. Contact the development team

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ using Next.js, Supabase, and Claude AI
