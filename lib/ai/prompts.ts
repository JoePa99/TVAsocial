export const STRATEGY_GENERATION_PROMPT = (companyOSContent: string) => `
Given this company's brand positioning, target audience, and business goals:

${companyOSContent}

Analyze the document and recommend:

1. Which social platforms to prioritize and why (consider audience demographics, content formats, and business goals)
2. 3-5 content pillars that align with their KPIs
3. 5-7 recurring content series with:
   - Series name
   - Description
   - Goal/purpose
   - Cadence (how often - e.g., "2x per month")
   - Recommended platforms
   - Tone (casual, professional, educational, etc.)
   - Example post concepts (3-5 examples)
   - Justification (why this series will drive results)
4. Monthly content themes for the next quarter

Focus on what will drive measurable results, not generic best practices.

Format your response as a JSON object with this structure:
{
  "platforms": ["Instagram", "LinkedIn", "TikTok"],
  "content_pillars": ["Brand Awareness", "Customer Education", "Community Building"],
  "kpis": ["Engagement Rate", "Follower Growth", "Website Clicks"],
  "series": [
    {
      "name": "Series Name",
      "description": "What this series is about",
      "goal": "What this achieves",
      "cadence": "2x per month",
      "platforms": ["Instagram", "TikTok"],
      "tone": "Educational and approachable",
      "examples": {
        "example1": "First example concept",
        "example2": "Second example concept",
        "example3": "Third example concept"
      }
    }
  ],
  "monthly_themes": {
    "January": "Theme for January",
    "February": "Theme for February",
    "March": "Theme for March"
  }
}

Only return valid JSON, no other text.
`;

export const CONTENT_GENERATION_PROMPT = (
  strategyContent: string,
  seriesDefinitions: string,
  month: string
) => `
Based on this social strategy:

${strategyContent}

And these series definitions:

${seriesDefinitions}

Generate 25 posts for ${month}.

Distribution:
- 60% from established series (educational, value-driven)
- 20% from celebration/brand series
- 10% wildcard posts that push creative boundaries (mark these with "wildcard": true)
- 10% timely/reactive content

For each post, provide:
- hook (1 sentence, attention-grabbing, under 15 words)
- body_copy (2-3 sentences, value-driven)
- cta (clear call to action)
- justification (why this post? how does it tie to strategy and KPIs?)
- visual_concept (detailed description for image generation - be specific about composition, colors, mood)
- platform (array of platforms this is optimized for)
- post_type ("Reel", "Carousel", "Story", "Static", or "Video")
- hashtags (array of 5-8 relevant hashtags)
- series_name (if applicable, the name of the series this belongs to)
- week (1-4, distribute posts evenly across the month)
- wildcard (boolean, true only for the bold/experimental posts)

Format as a JSON object with this structure:
{
  "posts": [
    {
      "hook": "Hook text here",
      "body_copy": "Body copy here",
      "cta": "CTA here",
      "justification": "Why this post matters",
      "visual_concept": "Detailed visual description",
      "platform": ["Instagram", "TikTok"],
      "post_type": "Reel",
      "hashtags": ["#tag1", "#tag2", "#tag3"],
      "series_name": "Series Name",
      "week": 1,
      "wildcard": false
    }
  ]
}

Only return valid JSON, no other text.
`;

export const HOOK_REFINEMENT_PROMPT = (
  originalHook: string,
  bodyCopy: string,
  seriesName: string,
  targetTone: string
) => `
Original hook: ${originalHook}
Post context: ${bodyCopy}
Series: ${seriesName}
Target tone: ${targetTone}

Generate 3 alternative hooks that are more ${targetTone}.
Keep each under 15 words.
Make them attention-grabbing and scroll-stopping.

Format as JSON:
{
  "alternatives": [
    "First alternative hook",
    "Second alternative hook",
    "Third alternative hook"
  ]
}

Only return valid JSON, no other text.
`;

export const IMAGE_PROMPT_GENERATION = (
  visualConcept: string,
  brandColors?: string[],
  brandTone?: string
) => `
Post visual concept: ${visualConcept}
${brandColors ? `Brand colors: ${brandColors.join(', ')}` : ''}
${brandTone ? `Brand tone: ${brandTone}` : ''}

Generate a detailed image generation prompt for Midjourney or DALL-E.

Include:
- Composition and framing
- Lighting and atmosphere
- Style and aesthetic
- Mood and emotion
- Brand integration (colors, tone)
- Technical details (angle, perspective)

Keep under 100 words. Be specific and vivid.

Format as JSON:
{
  "prompt": "Your detailed image prompt here"
}

Only return valid JSON, no other text.
`;
