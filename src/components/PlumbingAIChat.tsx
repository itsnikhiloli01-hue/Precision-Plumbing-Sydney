import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, PhoneCall, ShieldCheck, User, Phone, AlertTriangle, RefreshCw, ChevronDown, Check, Sparkles } from "lucide-react";
import { ChatMessage, LeadContext } from "../types";

interface PlumbingAIChatProps {
  onLeadContextChange: (ctx: LeadContext, urgency: "low" | "medium" | "emergency") => void;
  leadContext: LeadContext;
  urgencyState: "low" | "medium" | "emergency";
}

export default function PlumbingAIChat({ onLeadContextChange, leadContext, urgencyState }: PlumbingAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi there! I'm your **Precision Plumbing AI Assistant**.\n\nI can help you analyze leaks, blockages, pipe bursts, or hot water breakdowns. I'll pre-diagnose your problem, estimate the urgency, and help arrange priority dispatch.\n\n**To get started, what plumbing issues are you experiencing today?**",
      timestamp: new Date(),
      urgency: "low",
      suggestedAction: "chat"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessageAlert, setHasNewMessageAlert] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested pre-programmed prompts
  const suggestions = [
    { label: "🚰 Leaking tap", text: "I have a leaking tap in my laundry room." },
    { label: "🚽 Blocked drain", text: "My kitchen or bathroom drain is fully blocked and bubbling." },
    { label: "🔥 No hot water", text: "No hot water coming out of our showers. The unit is cold." },
    { label: "💥 Kitchen pipe burst", text: "Urgent! Pipe burst in my kitchen and water is leaking everywhere." }
  ];

  // Auto-scroll chat window when new texts or isTyping state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Flash warning/badge on desktop when minimizing and new message arrives
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessageAlert(true);
    }
  }, [messages.length, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).slice(2, 9),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Map existing messages to raw payload
      const historyPayload = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          currentContext: leadContext
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact premium plumbing assistant server.");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36).slice(2, 9),
        role: "assistant",
        content: data.message || "I've logged your request. What's your contact number?",
        timestamp: new Date(),
        urgency: data.urgency || "low",
        suggestedAction: data.suggestedAction || "chat",
        collectedInfo: data.collectedInfo
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Sync lead attributes (Name, Phone, Issue) back to parent context
      if (data.collectedInfo) {
        const updatedCtx: LeadContext = {
          name: data.collectedInfo.name || leadContext.name,
          phone: data.collectedInfo.phone || leadContext.phone,
          issue: data.collectedInfo.issue || leadContext.issue || textToSend
        };
        onLeadContextChange(updatedCtx, data.urgency || "low");
      }
    } catch (err) {
      console.error("AI assistant endpoint issues: ", err);
      // Fallback fallback response
      setMessages(prev => [
        ...prev,
        {
          id: "error-fallback",
          role: "assistant",
          content: "I'm having a connection glitch, but priority plumber dispatch is still fully alive! Please call our immediate help desk at **+61 468 991 817** to speak to back-office directly.",
          timestamp: new Date(),
          urgency: "emergency",
          suggestedAction: "call"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "👋 Back in prompt! I am your interactive **Precision Plumbing AI assistant**.\n\nDescribe your issue to pre-diagnose and queue technician dispatch.",
        timestamp: new Date(),
        urgency: "low",
        suggestedAction: "chat"
      }
    ]);
    onLeadContextChange({ name: "", phone: "", issue: "" }, "low");
  };

  // Convert markdown bold/italics for comfortable rendering
  const renderMessageContent = (text: string) => {
    // Basic parser for **bold** and emoji/newlines
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const latestUrgency = messages[messages.length - 1]?.urgency || urgencyState || "low";

  return (
    <>
      {/* Floating launcher bubble */}
      <button
        id="ai-assistant-launcher-btn"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-blue-brand to-cyan-brand text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto flex items-center justify-center cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNewMessageAlert(false);
        }}
      >
        <div className="relative">
          <MessageSquare className="w-7 h-7" />
          {hasNewMessageAlert && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping" />
          )}
        </div>
        <span className="hidden md:inline font-semibold font-display text-sm ml-2.5 mr-1 pr-1 border-l border-white/20 pl-2.5">
          AI Plumbing Chat
        </span>
      </button>

      {/* Actual Chat panel */}
      {isOpen && (
        <div
          id="ai-assistant-chat-panel"
          className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-96 h-[520px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden pointer-events-auto"
        >
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-950 px-5 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-brand to-cyan-brand flex items-center justify-center text-white font-black text-sm shadow-md">
                PP
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display flex items-center gap-1.5 leading-none">
                  Precision AI Assistant
                  <Sparkles className="w-3.5 h-3.5 text-cyan-brand animate-pulse" />
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sydney NSW 24/7 Dispatch Desk
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={clearChat}
                title="Restart chat session"
                className="p-1 px-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px] font-mono flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Core Urgency and Field Extraction Matrix Indicator */}
          <div className="bg-slate-50 dark:bg-slate-950 px-5 py-2 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between text-[11px] select-none">
            {/* Live Urgency gauge */}
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="text-slate-500 dark:text-slate-450 uppercase font-mono">Urgency:</span>
              {latestUrgency === "emergency" ? (
                <span className="text-red-600 dark:text-red-400 flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 rounded animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" /> Emergency (Immediate call advice)
                </span>
              ) : latestUrgency === "medium" ? (
                <span className="text-amber-600 dark:text-accent-amber font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">
                  ⚠️ Medium (Book same-day)
                </span>
              ) : (
                <span className="text-blue-600 dark:text-cyan-brand font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">
                  ✅ Low Priority
                </span>
              )}
            </div>

            {/* Lead parsing feedback tracker */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-0.5 text-slate-500" title="Contact name recorded">
                <User className={`w-3.5 h-3.5 ${leadContext.name ? "text-emerald-500" : "text-slate-350"}`} />
                {leadContext.name ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : null}
              </span>
              <span className="flex items-center gap-0.5 text-slate-500" title="Contact phone recorded">
                <Phone className={`w-3.5 h-3.5 ${leadContext.phone ? "text-emerald-500" : "text-slate-350"}`} />
                {leadContext.phone ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : null}
              </span>
            </div>
          </div>

          {/* Messages screen */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm border ${
                    msg.role === "user"
                      ? "bg-blue-brand border-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-none"
                  }`}
                >
                  {msg.role === "user" ? msg.content : renderMessageContent(msg.content)}
                </div>

                {/* Sub-block action indicator inside chat bubble when urgency evaluated */}
                {msg.role === "assistant" && msg.suggestedAction === "call" && (
                  <div className="mt-2 w-full max-w-[85%]">
                    <a
                      href="tel:+61468991817"
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-650 hover:bg-red-750 text-white bg-red-600 font-bold font-display rounded-xl text-xs shadow-md animate-urgent py-2.5"
                    >
                      <PhoneCall className="w-4 h-4" />
                      👉 Call Emergency Plumber Now
                    </a>
                  </div>
                )}

                <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 max-w-28 shadow-sm">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Preset Suggestions widget layout */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/60">
              <p className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase font-mono tracking-wider">
                Common issue shortcuts:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug.text)}
                    className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-755 dark:text-slate-310 hover:bg-blue-50 dark:hover:bg-slate-700/80 hover:text-blue-brand px-2 py-1 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-105"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Lead tracking prefill notifications inside chat panel bottom bar */}
          {(leadContext.name || leadContext.phone || leadContext.issue) && (
            <div className="px-4 py-1.5 bg-emerald-500/5 border-t border-emerald-500/10 flex items-center justify-between text-[10px] text-emerald-800 dark:text-emerald-400 select-none">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Automatic Lead Dispatch ticket prefilled!
              </span>
              <a href="#quick-quote-form-container" onClick={() => setIsOpen(false)} className="underline font-bold hover:text-emerald-600">
                View Form
              </a>
            </div>
          )}

          {/* Message inputs box */}
          <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 flex items-center gap-1.5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything or describe pipe leak..."
              disabled={isTyping}
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-1.5 focus:ring-blue-brand focus:border-blue-brand disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 rounded-xl bg-blue-brand hover:bg-blue-700 text-white transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
