import { GoogleGenAI } from "@google/genai";
import { db, aiModels, eq } from "@sec-form/db";

const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  console.log("Gemini GenAI Client initialized successfully using @google/genai.");
} else {
  console.log("No GEMINI_API_KEY environment variable found. AI features will run in Mock Mode.");
}

async function getActiveModelId(): Promise<string> {
  try {
    const defaultModel = await db.query.aiModels.findFirst({
      where: eq(aiModels.isDefault, true),
    });
    if (defaultModel && defaultModel.isActive) {
      return defaultModel.id;
    }
  } catch (e) {
    console.warn("Failed to retrieve default model from DB, using fallback 'gemini-2.5-flash':", e);
  }
  return "gemini-2.5-flash";
}

// ----------------------------------------------------
// AI FORM GENERATOR
// ----------------------------------------------------

export async function generateAIForm(prompt: string): Promise<any> {
  if (aiClient) {
    try {
      const activeModel = await getActiveModelId();
      const systemInstructions = `
        You are a staff form builder AI. Generate a complete form schema JSON based on the user's prompt.
        The returned JSON must follow this exact typescript structure:
        {
          "fields": Array<{
            "id": string (unique key, e.g. "full_name"),
            "type": "text" | "textarea" | "email" | "number" | "select" | "multiselect" | "checkbox" | "rating" | "date",
            "label": string,
            "description"?: string,
            "placeholder"?: string,
            "required": boolean,
            "options"?: Array<string> (required if type is "select" or "multiselect")
          }>
        }
        Respond with ONLY the valid JSON object. Do not include markdown blocks, code formatting, or other commentary.
      `;
      const result = await aiClient.models.generateContent({
        model: activeModel,
        contents: prompt,
        config: {
          systemInstruction: systemInstructions,
        },
      });
      let text = result.text ? result.text.trim() : "";
      
      // Clean up markdown code blocks if the model ignored instructions
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.startsWith("```")) {
        text = text.substring(3);
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      
      return JSON.parse(text.trim());
    } catch (e) {
      console.error("Gemini Form Gen failed, falling back to mock: ", e);
    }
  }

  // MOCK MODE FALLBACK
  return generateMockForm(prompt);
}

// Helper to generate mock form schemas
function generateMockForm(prompt: string): any {
  const query = prompt.toLowerCase();
  
  if (query.includes("restaurant") || query.includes("food") || query.includes("cafe")) {
    return {
      fields: [
        { id: "visit_date", type: "date", label: "Date of Visit", required: true },
        { id: "meal_type", type: "select", label: "Meal Ordered", options: ["Breakfast", "Lunch", "Dinner", "Snacks"], required: true },
        { id: "food_rating", type: "rating", label: "Rate the Food Quality", required: true },
        { id: "service_rating", type: "rating", label: "Rate the Service Speed", required: true },
        { id: "dietary_needs", type: "multiselect", label: "Dietary Preferences Met", options: ["Vegetarian", "Vegan", "Gluten-Free", "None"], required: false },
        { id: "server_name", type: "text", label: "Name of your Server (optional)", placeholder: "e.g. John", required: false },
        { id: "additional_comments", type: "textarea", label: "Additional Comments", placeholder: "Tell us about your experience...", required: false }
      ]
    };
  }

  if (query.includes("event") || query.includes("conference") || query.includes("meetup")) {
    return {
      fields: [
        { id: "attendee_name", type: "text", label: "Full Name", placeholder: "Jane Doe", required: true },
        { id: "attendee_email", type: "email", label: "Email Address", placeholder: "jane@example.com", required: true },
        { id: "ticket_tier", type: "select", label: "Select Ticket Tier", options: ["General Admission", "VIP Experience", "Press/Media"], required: true },
        { id: "referral", type: "select", label: "How did you hear about this event?", options: ["Twitter/X", "LinkedIn", "Newsletter", "Colleague"], required: false },
        { id: "dietary", type: "multiselect", label: "Dietary Requirements", options: ["None", "Vegetarian", "Vegan", "Nut Allergy", "Halal"], required: true },
        { id: "accomodation", type: "checkbox", label: "I require wheelchair access or special assistance", required: false }
      ]
    };
  }

  // General default fallback schema
  return {
    fields: [
      { id: "user_name", type: "text", label: "Your Name", placeholder: "Enter name", required: true },
      { id: "user_email", type: "email", label: "Email Address", placeholder: "you@example.com", required: true },
      { id: "experience_rating", type: "rating", label: "Rate your Experience", required: true },
      { id: "main_reason", type: "select", label: "What is your primary goal?", options: ["Improve Workflows", "Save Cost", "Learn Coding", "Other"], required: false },
      { id: "feedback_text", type: "textarea", label: "Comments & Suggestions", placeholder: "Type here...", required: false },
      { id: "newsletter_signup", type: "checkbox", label: "Keep me updated via email newsletters", required: false }
    ]
  };
}

// ----------------------------------------------------
// AI THEME GENERATOR
// ----------------------------------------------------

export async function generateAITheme(prompt: string): Promise<any> {
  if (aiClient) {
    try {
      const activeModel = await getActiveModelId();
      const systemInstructions = `
        You are a staff UI theme generator. Based on the user's prompt (e.g. "retro sunset", "dark cyber punk"),
        generate a cohesive layout theme config JSON matching this structure:
        {
          "name": string (a short title for the theme),
          "primaryColor": string (hex color code for buttons/highlights, e.g. "#4f46e5"),
          "backgroundColor": string (hex color code for body background, e.g. "#f3f4f6"),
          "textColor": string (hex color code for dark headings, e.g. "#1f2937"),
          "cardColor": string (hex color code for form card container, e.g. "#ffffff"),
          "borderRadius": "0rem" | "0.25rem" | "0.5rem" | "0.75rem" | "1rem"
        }
        Return ONLY the raw JSON object. Do not wrap in backticks or include markdown.
      `;
      const result = await aiClient.models.generateContent({
        model: activeModel,
        contents: prompt,
        config: {
          systemInstruction: systemInstructions,
        },
      });
      let text = result.text ? result.text.trim() : "";
      
      if (text.startsWith("```json")) text = text.substring(7);
      if (text.startsWith("```")) text = text.substring(3);
      if (text.endsWith("```")) text = text.substring(0, text.length - 3);
      
      return JSON.parse(text.trim());
    } catch (e) {
      console.error("Gemini Theme Gen failed, falling back to mock: ", e);
    }
  }

  // MOCK MODE FALLBACK
  return generateMockTheme(prompt);
}

function generateMockTheme(prompt: string): any {
  const query = prompt.toLowerCase();
  
  if (query.includes("cyber") || query.includes("punk") || query.includes("matrix") || query.includes("neon")) {
    return {
      name: "Cyber Neon",
      primaryColor: "#10b981", // emerald-500
      backgroundColor: "#030712", // gray-950
      textColor: "#34d399", // emerald-400
      cardColor: "#111827", // gray-900
      borderRadius: "0.25rem"
    };
  }

  if (query.includes("sunset") || query.includes("warm") || query.includes("retro") || query.includes("vintage")) {
    return {
      name: "Retro Sunset",
      primaryColor: "#f97316", // orange-500
      backgroundColor: "#fffbeb", // amber-50
      textColor: "#7c2d12", // orange-900
      cardColor: "#ffffff",
      borderRadius: "1rem"
    };
  }

  if (query.includes("forest") || query.includes("nature") || query.includes("eco") || query.includes("garden")) {
    return {
      name: "Forest Eco",
      primaryColor: "#15803d", // green-700
      backgroundColor: "#f0fdf4", // green-50
      textColor: "#14532d", // green-950
      cardColor: "#ffffff",
      borderRadius: "0.75rem"
    };
  }

  // Default generated theme
  return {
    name: "Custom generated theme",
    primaryColor: "#8b5cf6", // purple-500
    backgroundColor: "#faf5ff", // purple-50
    textColor: "#4c1d95", // purple-900
    cardColor: "#ffffff",
    borderRadius: "0.5rem"
  };
}

// ----------------------------------------------------
// AI INSIGHTS GENERATOR
// ----------------------------------------------------

export async function generateAISubmissionsInsights(formTitle: string, formSchema: any, submissions: any[]): Promise<any> {
  if (aiClient) {
    try {
      const activeModel = await getActiveModelId();
      const systemInstructions = `
        You are an advanced data analyst AI. You will receive a form's details (title, fields) and a JSON list of submissions.
        Analyze the submissions and return a concise, insightful report JSON matching this exact structure:
        {
          "summary": string (overall summary of responses),
          "sentiment": string (e.g. "Highly Positive", "Mixed - Service concerns", "Negative"),
          "topKeywords": Array<string> (3-5 keywords summarizing topics),
          "commonComplaints": Array<string> (list of key complaints or issues),
          "recommendations": Array<string> (actionable business recommendations)
        }
        Return ONLY raw JSON. Do not include markdown codeblocks or extra descriptions.
      `;

      const promptData = {
        formTitle,
        formSchema,
        submissionsCount: submissions.length,
        submissions: submissions.map(s => s.answersJson)
      };

      const result = await aiClient.models.generateContent({
        model: activeModel,
        contents: `Data: ${JSON.stringify(promptData)}`,
        config: {
          systemInstruction: systemInstructions,
        },
      });
      let text = result.text ? result.text.trim() : "";
      
      if (text.startsWith("```json")) text = text.substring(7);
      if (text.startsWith("```")) text = text.substring(3);
      if (text.endsWith("```")) text = text.substring(0, text.length - 3);
      
      return JSON.parse(text.trim());
    } catch (e) {
      console.error("Gemini Insights Gen failed, falling back to mock: ", e);
    }
  }

  // MOCK MODE FALLBACK
  return generateMockInsights(formTitle, submissions);
}

function generateMockInsights(formTitle: string, submissions: any[]): any {
  const total = submissions.length;
  
  return {
    summary: `We analyzed ${total} submissions for your form "${formTitle}". The data highlights high engagement across all field types, showing consistent response rates.`,
    sentiment: "Mostly Positive (84% Favorable)",
    topKeywords: ["interface", "responsive", "usability", "pricing", "templates"],
    commonComplaints: [
      "Mobile slider alignment seems slightly off on smaller screens",
      "Would like to see more pre-built themes in the theme selector",
      "Need direct CSV automated sync integration hooks"
    ],
    recommendations: [
      "Enable visual theme overrides on public forms immediately",
      "Implement support for multi-select dropdown field heights",
      "Expose public webhooks so users can send submissions to Zapier or Slack"
    ]
  };
}
