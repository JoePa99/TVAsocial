import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateImagePrompt } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const { visual_concept, brand_colors, brand_tone } = body;

    if (!visual_concept) {
      return NextResponse.json(
        { error: 'Visual concept is required' },
        { status: 400 }
      );
    }

    // Generate detailed image prompt using Gemini
    const imagePrompt = await generateImagePrompt(
      visual_concept,
      brand_colors,
      brand_tone
    );

    return NextResponse.json({ prompt: imagePrompt });
  } catch (error: any) {
    console.error('Image prompt generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
