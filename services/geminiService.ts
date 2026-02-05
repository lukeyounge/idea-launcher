import { StageId } from '../types';

interface ValidationResponse {
  isValid: boolean;
  feedbackMessage: string;
  confidence: number;
}

const VALIDATION_PROMPTS: Record<StageId, string> = {
  problem: `You are evaluating a user's description of a real-world problem or struggle they want to solve.
Respond with ONLY valid JSON (no markdown, no extra text): {"isValid": boolean, "feedback": "string"}
The feedback should be a single encouraging sentence (15-25 words) about what to improve.

Criteria for valid:
- Describes a real struggle or pain point (not generic, has emotional weight)
- Is specific enough to understand what bothers them
- Isn't just random words or placeholder text
- Shows they've thought about the problem

Text to evaluate:`,

  people: `You are evaluating a user's description of their target audience/users.
Respond with ONLY valid JSON (no markdown, no extra text): {"isValid": boolean, "feedback": "string"}
The feedback should be a single encouraging sentence (15-25 words) about what to improve.

Criteria for valid:
- Identifies a specific group of people (not "everyone")
- Describes who they are in some detail (students, friends, parents, etc.)
- Shows understanding of the audience's characteristics
- Isn't just random text

Text to evaluate:`,

  solution: `You are evaluating a user's description of an app idea or solution.
Respond with ONLY valid JSON (no markdown, no extra text): {"isValid": boolean, "feedback": "string"}
The feedback should be a single encouraging sentence (15-25 words) about what to improve.

Criteria for valid:
- Describes what the app actually does (concrete, not vague)
- Shows they understand the main purpose/feature
- Is specific enough to build from
- Isn't just random words or too generic

Text to evaluate:`,
};

export async function validateStageContent(
  stageId: StageId,
  text: string
): Promise<ValidationResponse> {
  try {
    const apiKey = (process.env as any).GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not configured');
      // Fallback: allow locking with reasonable content (80+ chars for meaningful thinking)
      return {
        isValid: text.length >= 80,
        feedbackMessage: text.length >= 80 ? 'Ready to lock' : 'Keep writing...',
        confidence: 0,
      };
    }

    const prompt = VALIDATION_PROMPTS[stageId] + '\n\n' + text;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=' +
        apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 100,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.statusText);
      return {
        isValid: text.length >= 80,
        feedbackMessage: text.length >= 80 ? 'Ready to lock' : 'Keep writing...',
        confidence: 0,
      };
    }

    const data = await response.json();
    const content =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the JSON response from Gemini
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not parse Gemini response:', content);
      return {
        isValid: text.length >= 80,
        feedbackMessage: text.length >= 80 ? 'Ready to lock' : 'Keep writing...',
        confidence: 0,
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      isValid: parsed.isValid,
      feedbackMessage: parsed.feedback || 'Keep refining your response',
      confidence: 0.8,
    };
  } catch (error) {
    console.error('Validation error:', error);
    // Fallback to character count if API fails
    return {
      isValid: text.length >= 80,
      feedbackMessage: text.length >= 80 ? 'Ready to lock' : 'Keep writing...',
      confidence: 0,
    };
  }
}
