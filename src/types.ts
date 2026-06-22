export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  urgency?: "low" | "medium" | "emergency";
  suggestedAction?: "call" | "book" | "chat";
  collectedInfo?: {
    name?: string;
    phone?: string;
    issue?: string;
  };
}

export interface LeadContext {
  name: string;
  phone: string;
  issue: string;
}

export interface PlumbingService {
  id: string;
  label: string;
  desc: string;
  iconName: string;
  isEmergency?: boolean;
  image?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
  location: string;
}
