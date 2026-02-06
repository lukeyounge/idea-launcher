import { StageId, POWER_SKILLS } from '../types';

interface SuggestionResponse {
  suggestions: string[];
}

interface PromptSynthesisResponse {
  prompt: string;
}

// Power Skills context to include in final prompts
const POWER_SKILLS_CONTEXT = `## SBF Power Skills Context

This app is designed around the Students for a Better Future (SBF) Power Skills framework. These are the 8 Power Skills that students develop:

1. **Agility** – Staying positive and adapting quickly when things change or don't go as planned.
2. **Analytical Thinking** – Breaking down information, spotting patterns, and solving problems using what matters most.
3. **Collaborative Relationships** – Working well with different people, communicating clearly, and building win-win outcomes.
4. **Critical Thinking** – Asking good questions, evaluating information, reflecting, and making better decisions.
5. **Financial Literacy** – Managing money wisely, balancing needs and wants, and working towards financial goals.
6. **Goal-Driven** – Setting challenging goals, taking responsibility, and staying accountable through obstacles.
7. **Innovative Thinking** – Trying creative solutions, taking smart risks, and challenging the usual way of doing things.
8. **Self-Management** – Regulating emotions, building resilience, knowing your strengths, and staying open to lifelong learning.

The app should reference these specific Power Skills where relevant, and help users develop or assess these skills.`;

const SUGGESTION_PROMPTS: Record<StageId, string> = {
  why: `You're helping a teenager (14-17 years old) build an app about Power Skills.

They're explaining WHY their app should exist. Here's what they wrote:
"[USER_TEXT]"

Give ONE friendly tip (max 25 words) to help them think deeper about why this matters.

IMPORTANT: Write like you're chatting with a teen - casual, encouraging, no jargon. Use "you" and "your".

Example good responses:
- "Nice start! What's the moment that made you think 'someone should fix this'?"
- "Love it! Can you add what makes this problem really annoying for people?"

Format exactly: "1. [your tip]"`,

  who: `You're helping a teenager (14-17 years old) build an app about Power Skills.

They're describing WHO will use their app. Here's what they wrote:
"[USER_TEXT]"

Give ONE friendly tip (max 25 words) to help them picture their users more clearly.

IMPORTANT: Write like you're chatting with a teen - casual, encouraging, no jargon. Use "you" and "your".

Example good responses:
- "Cool! Are these people more like your age or younger/older? That changes everything!"
- "Nice! What's a typical day like for these people? What stresses them out?"

Format exactly: "1. [your tip]"`,

  what: `You're helping a teenager (14-17 years old) build an app about Power Skills.

They're explaining WHAT their app does. Here's what they wrote:
"[USER_TEXT]"

Give ONE friendly tip (max 25 words) to help them describe the APP'S FEATURES and FUNCTIONALITY more clearly.

IMPORTANT:
- Focus ONLY on what the app DOES, not who uses it (that's already covered)
- Ask about features, main actions, or how it works
- Write like you're chatting with a teen - casual, encouraging, no jargon. Use "you" and "your".

Example good responses:
- "Sounds cool! When someone opens your app, what's the first thing they see?"
- "Nice! What's the ONE main thing users actually do in your app?"
- "Love it! Does it track progress, give tips, or something else?"

Example BAD responses to avoid:
- Don't ask about the audience/who uses it (that's for WHO stage)
- Don't ask why it matters (that's for WHY stage)
- Don't ask how it feels (that's for HOW stage)

Format exactly: "1. [your tip]"`,

  how: `You're helping a teenager (14-17 years old) build an app about Power Skills.

They're explaining HOW their app works. Here's what they wrote:
"[USER_TEXT]"

Give ONE friendly tip (max 25 words) to help them think through the experience.

IMPORTANT: Write like you're chatting with a teen - casual, encouraging, no jargon. Use "you" and "your".

Example good responses:
- "Nice! Walk me through it - what happens after someone taps the first button?"
- "Cool idea! What makes people want to come back and use it again?"

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
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' +
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
  appName: string,
  why: string,
  who: string,
  what: string,
  how: string,
  designItems: string[],
  functionalityItems: string[],
  userItems: string[],
  screenItems: string[]
): Promise<PromptSynthesisResponse> {
  // Skip API call and use fallback directly for instant, consistent results
  return {
    prompt: generateFallbackPrompt(appName, why, who, what, how, designItems, functionalityItems, userItems, screenItems),
  };
}

function generateFallbackPrompt(
  appName: string,
  why: string,
  who: string,
  what: string,
  how: string,
  designItems: string[],
  functionalityItems: string[],
  userItems: string[],
  screenItems: string[]
): string {
  const powerSkillsWithDescriptions = `1. **Agility** – Staying positive and adapting quickly when things change or don't go as planned.
2. **Analytical Thinking** – Breaking down information, spotting patterns, and solving problems using what matters most.
3. **Collaborative Relationships** – Working well with different people, communicating clearly, and building win-win outcomes.
4. **Critical Thinking** – Asking good questions, evaluating information, reflecting, and making better decisions.
5. **Financial Literacy** – Managing money wisely, balancing needs and wants, and working towards financial goals.
6. **Goal-Driven** – Setting challenging goals, taking responsibility, and staying accountable through obstacles.
7. **Innovative Thinking** – Trying creative solutions, taking smart risks, and challenging the usual way of doing things.
8. **Self-Management** – Regulating emotions, building resilience, knowing your strengths, and staying open to lifelong learning.`;

  return `# Build "${appName}" - A Power Skills App

## The App

**App Name:** ${appName}

**WHY this app exists:**
${why}

**WHO it's for:**
${who}

**WHAT it does:**
${what}

**HOW it works:**
${how}

---

## Design Requirements

### VISUAL VIBE
${designItems.length > 0 ? designItems.map(item => `- ${item}`).join('\n') : '- Clean, modern design\n- Mobile-friendly layout'}

### HOW IT WORKS
${functionalityItems.length > 0 ? functionalityItems.map(item => `- ${item}`).join('\n') : '- Smooth, intuitive interactions\n- Clear feedback on actions'}

### USER FEELINGS
${userItems.length > 0 ? userItems.map(item => `- ${item}`).join('\n') : '- Encouraging and supportive\n- Celebrates progress'}

### APP SCREENS
${screenItems.length > 0 ? screenItems.map(item => `- ${item}`).join('\n') : '- Home screen or dashboard\n- Progress tracking page'}

---

Build this using React and Tailwind CSS.

---

## SBF Power Skills Context

This app is designed around the Students for a Better Future (SBF) Power Skills framework. These are the 8 Power Skills:

${powerSkillsWithDescriptions}

The app should reference these specific Power Skills where relevant.`;
}
