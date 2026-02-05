# Idea Launcher - Project Overview & PRD

## What This App Does

Idea Launcher is a **prompt engineering workshop tool** that helps users develop excellent first prompts for vibe-coding apps with Claude. It guides users through the design thinking framework to deeply articulate their app idea, then synthesizes those inputs into a polished, comprehensive prompt ready for Claude's AI Studio.

The app is NOT a builder - it's a thinking tool. Users walk through three distinct thinking stages, get Gemini-powered coaching, lock in their ideas, curate design/function/experience details, and then export a world-class prompt for their vibe-coding session.

---

## Complete User Flow

### Stage 1: Foundation Thinking (Workspace View)
Users write three core design thinking elements, with Gemini coaching on each:

1. **The Struggle** - "What is the pain point people face?"
   - User articulates a compelling, specific pain point
   - Gemini coaches: "Describe the emotional toll" or "Explain the specific behavior causing this"
   - Goal: Clear, resonant problem statement that matters

2. **The Crowd** - "Who are you building this for?"
   - User describes their target audience/users
   - Gemini coaches: "Add age range" or "Replace generic terms with specific job titles"
   - Goal: Concrete audience definition that's buildable

3. **The Big Idea** - "What does your app actually do?"
   - User describes their solution/app
   - Gemini coaches: "Describe what users see on screen" or "Explain the core action"
   - Goal: Specific, buildable solution description

**Gemini Coaching Details:**
- ONE suggestion per click (max 20 words)
- Field-specific (no bleeding into other fields)
- Focus on deepening thinking, not giving answers
- Examples: "Describe specific behaviors", "Add emotional impact", "Be concrete about features"

### Stage 2: Implementation Nodes (Approval View - "Vibe Logic")
User curates the app's **design language**, **engine capabilities**, and **human experience** requirements.

Three categories to select/add from:
- **Visual Language** - What the app looks like/feels like visually
- **Engine Capabilities** - Core features & functionality the app has
- **Human Experience** - How using this makes people feel, what needs it serves

These aren't just buttons - each selection directly feeds into the final prompt. Users are building the **implementation blueprint** for their vibe coding session. Subtitle "Picking The Implementation Nodes" should clarify this is about selecting the core tech/design/UX pillars.

### Stage 3: Final Prompt Assembly (Final Review View)
The app synthesizes everything into a comprehensive prompt using this structure:

```
I want to build an app that fixes this struggle: "[User's Struggle]"
For this crowd: "[User's Audience]"
The big fix: "[User's Solution]"

VISUAL VIBE:
- [Selected/custom visual language items]

HOW IT WORKS:
- [Selected/custom engine capability items]

USER FEELINGS:
- [Selected/custom human experience items]

Build this using React and Tailwind CSS. Make it look high-class and vibe-code ready.
```

This prompt is then copied and pasted into Claude's AI Studio for the actual vibe-coding session.

---

## Key Design Principles

1. **Thinking Tool, Not Builder** - We're not building the app, we're preparing the prompt to build it
2. **Design Thinking Framework** - Struggle → Crowd → Solution provides structure
3. **Gemini Coaching** - One focused tip per field to deepen thinking (not answer for them)
4. **Meaningful Selection** - Each node selected goes into the final prompt (not busywork)
5. **Export for Claude** - Final prompt is optimized for vibe-coding with Claude

---

## Current Technical Implementation

### Gemini Integration (getSuggestions)
- **Model**: `gemini-3-flash-preview`
- **Temperature**: 0.7 (creative but focused)
- **Max Tokens**: 1000
- **Prompts**: Field-specific coaching prompts that prevent bleeding between categories

### Prompt Generation (generatePromptText)
Assembles user inputs into a vibe-coding ready prompt with:
- User's struggle, crowd, and solution
- Selected/custom design language items
- Selected/custom capability items
- Selected/custom experience items
- Instructions to use React + Tailwind

---

## Recommendations for Improvement

### 1. **Upgrade to Gemini 3 Pro for Final Prompt Generation**
Consider using a better model (Gemini 3 Pro if available) for generating the final prompt synthesis, since that's the critical output. The coaching suggestions can stay on Flash, but the final prompt deserves a more sophisticated model for better reasoning about how to structure all the inputs into a coherent vibe-coding brief.

### 2. **Clarify "Implementation Nodes" Subtitle**
Change "Picking The Implementation Nodes" to something like:
- "Curate Your Design Pillars"
- "Define Your Core Vibe"
- "Select Implementation Details"

This makes it clearer that we're choosing the specific tech/design/UX requirements that will guide Claude's vibe-coding session.

### 3. **Visual Language Clarification**
Add a small help tooltip or subtitle under each category (Visual Language, Engine Capabilities, Human Experience) explaining what should go there:
- Visual Language: "Aesthetic, style, design direction"
- Engine Capabilities: "Core features, interactions, technical behaviors"
- Human Experience: "How it feels to use, emotional outcomes, user satisfaction"

### 4. **Prompt Quality Assurance**
Before copying, users should see their complete assembled prompt and be able to:
- See exactly what will be sent to Claude
- Understand how each element was incorporated
- Make refinements if needed

---

## Success Metrics

The app succeeds if:
1. ✅ Users clearly articulate their struggle (not vague)
2. ✅ Users define a specific crowd (not "everyone")
3. ✅ Users describe a buildable solution (not abstract)
4. ✅ The final prompt is excellent enough that Claude can immediately start vibe-coding
5. ✅ Users feel they've done the thinking work upfront (not left guessing during coding)

---

## Next Steps

1. Test the current flow end-to-end with real vibe-coding
2. Consider Gemini 3 Pro upgrade for final prompt generation
3. Refine UI language to clarify "Implementation Nodes" concept
4. Add tooltips/help text for each selection category
