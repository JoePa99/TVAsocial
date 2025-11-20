// User roles
export type UserRole = 'consultant' | 'agency' | 'client';

// Post status
export type PostStatus = 'draft' | 'agency_review' | 'client_review' | 'approved';

// Post types
export type PostType = 'Reel' | 'Carousel' | 'Story' | 'Static' | 'Video';

// Platforms
export type Platform = 'Instagram' | 'YouTube' | 'TikTok' | 'LinkedIn' | 'Twitter' | 'Facebook';

// User
export interface User {
  id: string;
  email: string;
  role: UserRole;
  assigned_clients?: string[]; // For agency users
  client_id?: string; // For client users
  created_at: string;
  updated_at: string;
}

// Strategy (per client)
export interface Strategy {
  id: string;
  client_id: string;
  platforms: Platform[];
  content_pillars: string[];
  kpis: string[];
  monthly_themes: Record<string, string>; // { "January": "Building trust..." }
  company_os_url?: string; // URL to uploaded document
  created_at: string;
  updated_at: string;
}

// Series (recurring content themes)
export interface Series {
  id: string;
  strategy_id: string;
  name: string;
  description: string;
  goal: string;
  cadence: string; // "2x per month"
  platforms: Platform[];
  tone: string;
  examples: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Post (individual content pieces)
export interface Post {
  id: string;
  strategy_id: string;
  series_id?: string | null;
  month: string;
  week: number;
  post_date: string;
  platform: Platform[];
  post_type: PostType;
  hook: string;
  body_copy: string;
  cta: string;
  hashtags: string[];
  justification: string;
  wildcard: boolean;
  visual_concept: string;
  image_url?: string | null;
  status: PostStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Comment
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  text: string;
  created_at: string;
  user?: User; // Joined user data
}

// AI Generation Types
export interface StrategyGenerationInput {
  company_os_content: string;
  client_id: string;
}

export interface StrategyGenerationOutput {
  platforms: Platform[];
  content_pillars: string[];
  kpis: string[];
  series: Omit<Series, 'id' | 'strategy_id' | 'created_at' | 'updated_at'>[];
  monthly_themes: Record<string, string>;
}

export interface ContentGenerationInput {
  strategy_id: string;
  month: string;
  week?: number;
}

export interface ContentGenerationOutput {
  posts: Omit<Post, 'id' | 'created_by' | 'created_at' | 'updated_at'>[];
}

export interface HookRefinementInput {
  original_hook: string;
  body_copy: string;
  series_name?: string;
  tone: string;
}

export interface HookRefinementOutput {
  alternatives: string[];
}

export interface ImagePromptInput {
  visual_concept: string;
  brand_colors?: string[];
  brand_tone?: string;
}

export interface ImagePromptOutput {
  prompt: string;
}
