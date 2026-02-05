import { StageId } from '../types';

interface ValidationResponse {
  isValid: boolean;
  feedbackMessage: string;
  confidence: number;
}

interface SuggestionResponse {
  suggestions: string[];
}

const SUGGESTION_PROMPTS: Record<StageId, string> = {
  problem: `The user is describing a real-world problem or struggle they want to solve with an app.
Their goal is to identify a genuine pain point that affects real people and has emotional weight.

Here's what they've written:

<userContent>
[USER_TEXT]
</userContent>

Please provide 2-3 specific, constructive suggestions to help them improve their problem description. Focus on:
- Making it more specific and concrete (not generic)
- Adding emotional resonance or context
- Clarifying who exactly is affected

Format as a numbered list. Be encouraging and practical.`,

  people: `The user is describing their target audience or users for an app they want to build.
Their goal is to identify a specific group of people they want to serve, with clear characteristics.

Here's what they've written:

<userContent>
[USER_TEXT]
</userContent>

Please provide 2-3 specific, constructive suggestions to help them improve their audience description. Focus on:
- Making it more specific (move away from "everyone")
- Adding details about who these people are
- Clarifying what they have in common or what matters about them

Format as a numbered list. Be encouraging and practical.`,

  solution: `The user is describing an app idea or solution they want to build to solve a problem.
Their goal is to articulate what the app actually does, clearly and concretely.

Here's what they've written:

<userContent>
[USER_TEXT]
</userContent>

Please provide 2-3 specific, constructive suggestions to help them improve their solution description. Focus on:
- Making it more concrete and specific (less vague)
- Clarifying what the app actually does
- Adding enough detail that someone could build from it

Format as a numbered list. Be encouraging and practical.`,
};

export async function getSuggestions(
  stageId: StageId,
  text: string
): Promise<SuggestionResponse> {
  try {
    const apiKey = (process.env as any).GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not configured');
      return {
        suggestions: ['Could not connect to Gemini. Try again or continue refining on your own.'],
      };
    }

    const prompt = SUGGESTION_PROMPTS[stageId].replace('[USER_TEXT]', text);

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=' +
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
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.statusText);
      return {
        suggestions: ['Unable to get suggestions. Please try again.'],
      };
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the response - it should be plain text with numbered suggestions
    const suggestions = content
      .split('\n')
      .filter((line: string) => line.trim().match(/^\d+\./))
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

    return {
      suggestions: suggestions.length > 0 ? suggestions : ['No suggestions available at this time.'],
    };
  } catch (error) {
    console.error('Suggestion error:', error);
    return {
      suggestions: ['An error occurred. Please try again.'],
    };
  }
}
