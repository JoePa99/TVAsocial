import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import Anthropic from '@anthropic-ai/sdk';
import { STRATEGY_GENERATION_PROMPT } from '@/lib/ai/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('consultant');
    const supabase = await createClient();
    const body = await request.json();

    const { client_id, document_url } = body;

    if (!client_id || !document_url) {
      return NextResponse.json(
        { error: 'Client ID and document URL are required' },
        { status: 400 }
      );
    }

    // For now, we'll use a placeholder for document parsing
    // In production, you'd want to extract text from PDF/DOCX
    const companyOSContent = `
      This is a placeholder for the extracted company OS content.
      In production, implement PDF/DOCX text extraction here.
      Document URL: ${document_url}
    `;

    // Generate strategy with Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: STRATEGY_GENERATION_PROMPT(companyOSContent),
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const strategyData = JSON.parse(responseText);

    // Create strategy in database
    const { data: strategy, error: strategyError } = await supabase
      .from('strategies')
      .insert({
        client_id,
        platforms: strategyData.platforms,
        content_pillars: strategyData.content_pillars,
        kpis: strategyData.kpis,
        monthly_themes: strategyData.monthly_themes,
        company_os_url: document_url,
      })
      .select()
      .single();

    if (strategyError) throw strategyError;

    // Create series
    const seriesPromises = strategyData.series.map((series: any) =>
      supabase.from('series').insert({
        strategy_id: strategy.id,
        name: series.name,
        description: series.description,
        goal: series.goal,
        cadence: series.cadence,
        platforms: series.platforms,
        tone: series.tone,
        examples: series.examples,
      })
    );

    await Promise.all(seriesPromises);

    return NextResponse.json({ strategy, series: strategyData.series });
  } catch (error: any) {
    console.error('Strategy generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
