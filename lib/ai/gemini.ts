import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateImageWithGemini(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Generate image using Gemini
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'text/plain',
          data: prompt,
        },
      },
    ]);

    const response = await result.response;
    const imageData = response.text();

    // For now, return a placeholder
    // In production, you'd process the actual image data returned by Gemini
    return imageData;
  } catch (error: any) {
    console.error('Gemini image generation error:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

export async function generateImagePrompt(
  visualConcept: string,
  brandColors?: string[],
  brandTone?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const promptInstruction = `
Given this visual concept for a social media post:
"${visualConcept}"

${brandColors ? `Brand colors: ${brandColors.join(', ')}` : ''}
${brandTone ? `Brand tone: ${brandTone}` : ''}

Generate a detailed, vivid image generation prompt that:
1. Describes the composition and framing
2. Specifies lighting and atmosphere
3. Defines the style and aesthetic
4. Captures the mood and emotion
5. Incorporates brand colors naturally
6. Includes technical details (angle, perspective)

Keep it under 100 words but be highly specific and descriptive.
Return ONLY the image prompt, no other text.
`;

  const result = await model.generateContent(promptInstruction);
  const response = await result.response;
  return response.text().trim();
}
