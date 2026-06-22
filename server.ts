import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google GenAI on the server with API key
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Chat feature will run in fallback demo mode.");
}

app.use(express.json());

// API: Server Status / Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!ai });
});

// API: Interactive AI Plumbing Assistant
app.post("/api/chat", async (req, res) => {
  const { messages, currentContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  // Fallback mode if Gemini API key is missing
  if (!ai) {
    const lastMessage = messages[messages.length - 1]?.content || "";
    let mockResponse = {
      message: "Thanks for reaching out! To assist you best, could you please share your name, phone number, and confirm your plumbing issue so our Sydney NSW team can contact you or booking you in immediately?",
      urgency: "medium",
      suggestedAction: "book",
      collectedInfo: {
        name: "",
        phone: "",
        issue: lastMessage.slice(0, 50)
      }
    };

    const textLower = lastMessage.toLowerCase();
    if (textLower.includes("burst") || textLower.includes("emergency") || textLower.includes("flood") || textLower.includes("leak")) {
      mockResponse.message = "🔴 **URGENT:** That sounds like a pipe burst or severe leak, which is a major plumbing emergency. Since we operate 24/7 in Sydney NSW, we recommend calling Joe and our team immediately at **+61 468 991 817** to stop water damage!";
      mockResponse.urgency = "emergency";
      mockResponse.suggestedAction = "call";
      mockResponse.collectedInfo.issue = "Active pipe burst or urgent leak";
    } else if (textLower.includes("blocked") || textLower.includes("drain") || textLower.includes("toilet")) {
      mockResponse.message = "🚽 **Blocked Drain:** Blocked toilets or sewers can escalate quickly. We can send a Sydney local plumber with high-pressure water jet equipment to inspect and clear your drain today. Could you please provide your **Phone Number** and **Name** so we can lock in a free upfront inspection quote?";
      mockResponse.urgency = "medium";
      mockResponse.suggestedAction = "book";
      mockResponse.collectedInfo.issue = "Blocked drain issue";
    } else if (textLower.includes("hot water") || textLower.includes("cold shower") || textLower.includes("no hot water")) {
      mockResponse.message = "🔥 **No Hot Water:** Let's get that fixed. This is usually due to a thermostat failure, tank leak, or burnt-out heating element. We do same-calendar-day hot water repairs across Sydney. May I have your name and contact phone number to book an expert plumber immediately?";
      mockResponse.urgency = "medium";
      mockResponse.suggestedAction = "book";
      mockResponse.collectedInfo.issue = "No hot water / hot water unit breakdown";
    }

    // Attempt simple regex extraction to simulate premium behavior in demo mode
    const phoneMatch = lastMessage.match(/(?:\+61|0)[4-9]\d{8}/g);
    if (phoneMatch) {
      mockResponse.collectedInfo.phone = phoneMatch[0];
      mockResponse.message = `Perfect, got your phone number: **${phoneMatch[0]}**. What is your name so we can address you correctly and coordinate our technician?`;
    }

    return res.json(mockResponse);
  }

  try {
    // We construct a chat payload with system instructions
    const systemInstruction = `You are "Precision Plumbing AI Assistant", a premium virtual helper for "Precision Plumbing Sydney NSW".
Your goal is to reassure, pre-diagnose their problem, determine how urgent it is, and gather lead information (Name, Phone Number, and Plumbing Issue description) so we can convert them into a service call or emergency booking.

Business Context to use:
- Name: Precision Plumbing Sydney NSW
- Phone: +61 468 991 817 (Available 24/7 for Emergency Plumbing)
- Location: Sydney, NSW, Australia (Servicing all of Sydney)
- Rating: 5.0 Stars (35+ reviews)
- Availability: 24/7 same-day plumbing response

Rules of behavior:
1. Warm, professional, supportive, expert-plumber tone. Be very polite and reassuring.
2. If the user mentions extreme issues (e.g. pipe burst, major flooding, sewer backflow, main gas odor, active ceiling leak):
   - Set "urgency" to "emergency".
   - Set "suggestedAction" to "call".
   - Firmly advice them to call our immediate dispatch plumber on +61 468 991 817. Explain that they shouldn't wait as water can cause thousands of dollars in property damage.
3. If they describe normal repairs (e.g. "my kitchen tap is dripping", "leaking garden faucet", "bathroom renovation planning", "standard drain cleaning"):
   - Set "urgency" to "low" or "medium".
   - Set "suggestedAction" to "book".
   - Offer to book a local expert.
4. Try to gather the following fields conversatively:
   - "name": The user's name
   - "phone": The user's phone number (often Australian format, e.g. 04xx xxx xxx or +61 4...)
   - "issue": Brief description of what is wrong (e.g., "leaking kitchen tap")
   Observe current values passed in currentContext, and if you identify new values in the latest message, update them!
5. ALWAYS output the exact JSON structure requested in responseSchema, and keep your markdown text response inside the "message" key. No extra markdown tags or wrappers outside the raw JSON.`;

    // Map history to contents payload
    const contents = messages.map(m => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }]
    }));

    // Append context of previously collected fields so Gemini can maintain state
    const contextPrompt = `\n[SYSTEM STATE INFO] Previously extracted lead tracker context: Name: "${currentContext?.name || ""}", Phone: "${currentContext?.phone || ""}", Issue: "${currentContext?.issue || ""}". Scan the last message carefully to extract any missing Name, Phone Number, or description details. If any are found, update them in the collectedInfo return values. Ensure you reply using the requested JSON format.`;
    
    if (contents.length > 0 && contents[contents.length - 1].parts[0]) {
      contents[contents.length - 1].parts[0].text += contextPrompt;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["message", "urgency", "suggestedAction", "collectedInfo"],
          properties: {
            message: {
              type: Type.STRING,
              description: "The supportive and professional conversational response in markdown. Address the user directly, answer questions, ask reassuring followups, and prompt them for any missing contact details."
            },
            urgency: {
              type: Type.STRING,
              enum: ["low", "medium", "emergency"],
              description: "The estimated severity of the plumbing plumbing issue."
            },
            suggestedAction: {
              type: Type.STRING,
              enum: ["call", "book", "chat"],
              description: "The best call to action: 'call' if emergency, 'book' if standard booking, 'chat' if still identifying the problem."
            },
            collectedInfo: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Extracted name of the customer, or empty if unknown." },
                phone: { type: Type.STRING, description: "Extracted phone/mobile number, or empty if unknown." },
                issue: { type: Type.STRING, description: "A summarized clear phrase of the customer's plumbing issue, or empty if unknown." }
              }
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Error processing your request in our premium Sydney plumbing system.",
      message: error?.message || "Internal Error"
    });
  }
});

// Start listening and integrate Vite Dev Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite dev server middlewares
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    // Serve production static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Precision Plumbing Sydney NSW Service] Running on http://localhost:${PORT}`);
  });
}

startServer();
