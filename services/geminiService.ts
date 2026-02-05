import { StageId } from '../types';

interface ValidationResponse {
  isValid: boolean;
  feedbackMessage: string;
  confidence: number;
}

interface SuggestionResponse {
  suggestions: string[];
}

interface PromptSynthesisResponse {
  prompt: string;
}

const SUGGESTION_PROMPTS: Record<StageId, string> = {
  problem: `The user is defining THE STRUGGLE - the specific pain point or problem they want to solve.

Their description: "[USER_TEXT]"

Give ONE coaching tip (max 20 words) to deepen their pain point articulation. Do NOT suggest audience info.

Focus on: the specific behavior causing pain, emotional/practical consequence, why it matters, or how intense it is.

Format exactly: "1. [your tip]"`,

  people: `The user is defining THE CROWD - their specific target audience/users.

Their description: "[USER_TEXT]"

Give ONE coaching tip (max 20 words) to make their audience more concrete. Do NOT suggest changes to the problem.

Focus on: replacing vague terms with specifics, adding details (age/job/life stage), what they share, or their constraints.

Format exactly: "1. [your tip]"`,

  solution: `The user is defining THE BIG IDEA - what their app actually does.

Their description: "[USER_TEXT]"

Give ONE coaching tip (max 20 words) to make their solution clearer and more buildable. Do NOT suggest problem or audience changes.

Focus on: the core user action, what users see, the main feature, or how it solves the pain point.

Format exactly: "1. [your tip]"`,
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
            maxOutputTokens: 1000,
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
    const lines = content.split('\n');
    const suggestions = lines
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .filter((line: string) => line.match(/^\d+\./))
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

    // If no numbered suggestions found, try to split by sentence or return the whole content as suggestions
    if (suggestions.length === 0) {
      // Try to split by sentence and return first few non-empty lines as suggestions
      const sentences = content
        .split(/[.!?]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 20)
        .slice(0, 3);

      return {
        suggestions: sentences.length > 0 ? sentences : ['Consider refining your description with more specific details.'],
      };
    }

    return {
      suggestions: suggestions,
    };
  } catch (error) {
    console.error('Suggestion error:', error);
    return {
      suggestions: ['An error occurred. Please try again.'],
    };
  }
}

export async function synthesizePrompt(
  struggle: string,
  crowd: string,
  solution: string,
  designItems: string[],
  functionalityItems: string[],
  userItems: string[]
): Promise<PromptSynthesisResponse> {
  try {
    const apiKey = (process.env as any).GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not configured');
      return {
        prompt: generateFallbackPrompt(struggle, crowd, solution, designItems, functionalityItems, userItems),
      };
    }

    const synthesisProp = `You are a world-class prompt engineer specializing in vibe-coding briefs for Claude.

The user has defined their app idea:
- Struggle/Problem: "${struggle}"
- Target Crowd: "${crowd}"
- Solution/Big Idea: "${solution}"

They've also selected these implementation pillars:
Visual Language: ${designItems.length > 0 ? designItems.map(item => `"${item}"`).join(', ') : 'Not specified'}
Engine Capabilities: ${functionalityItems.length > 0 ? functionalityItems.map(item => `"${item}"`).join(', ') : 'Not specified'}
Human Experience: ${userItems.length > 0 ? userItems.map(item => `"${item}"`).join(', ') : 'Not specified'}

Create an excellent, specific vibe-coding prompt that:
1. Opens with a clear problem statement (the user's struggle)
2. Defines the target user (the crowd)
3. Articulates the solution (what the app does)
4. Lists specific visual design requirements (VISUAL VIBE section)
5. Lists specific functionality requirements (HOW IT WORKS section)
6. Lists specific experience requirements (USER FEELINGS section)
7. Ends with clear instructions to build with React and Tailwind CSS

The prompt should be detailed, specific, and immediately actionable for a vibe-coding session. Each requirement should be concrete and buildable.

Output ONLY the prompt text, ready to copy and paste into Claude's AI Studio. Do not include explanations or markdown formatting.`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=' +
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
                  text: synthesisProp,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini synthesis API error:', response.statusText);
      return {
        prompt: generateFallbackPrompt(struggle, crowd, solution, designItems, functionalityItems, userItems),
      };
    }

    const data = await response.json();
    const synthesized = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!synthesized) {
      return {
        prompt: generateFallbackPrompt(struggle, crowd, solution, designItems, functionalityItems, userItems),
      };
    }

    return {
      prompt: synthesized.trim(),
    };
  } catch (error) {
    console.error('Prompt synthesis error:', error);
    return {
      prompt: generateFallbackPrompt(struggle, crowd, solution, designItems, functionalityItems, userItems),
    };
  }
}

function generateFallbackPrompt(
  struggle: string,
  crowd: string,
  solution: string,
  designItems: string[],
  functionalityItems: string[],
  userItems: string[]
): string {
  return `I want to build an app that fixes this struggle: "${struggle}"
For this crowd: "${crowd}"
The big fix: "${solution}"

VISUAL VIBE:
${designItems.length > 0 ? designItems.map(item => `- ${item}`).join('\n') : '- Premium, clean aesthetic'}

HOW IT WORKS:
${functionalityItems.length > 0 ? functionalityItems.map(item => `- ${item}`).join('\n') : '- Smooth, interactive features'}

USER FEELINGS:
${userItems.length > 0 ? userItems.map(item => `- ${item}`).join('\n') : '- Designed specifically for the crowd mentioned above'}

Build this using React and Tailwind CSS. Make it look high-class and vibe-code ready.`;
}
