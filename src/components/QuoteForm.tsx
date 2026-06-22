import React, { useState, useEffect } from "react";
import { Send, FileText, CheckCircle, ShieldCheck, Wrench } from "lucide-react";

interface QuoteFormProps {
  initialName?: string;
  initialPhone?: string;
  initialIssue?: string;
  onSubmitSuccess?: (data: { name: string; phone: string; issue: string }) => void;
}

export default function QuoteForm({
  initialName = "",
  initialPhone = "",
  initialIssue = "",
  onSubmitSuccess
}: QuoteFormProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [issue, setIssue] = useState(initialIssue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync state with prefilled values from the AI assistant
  useEffect(() => {
    if (initialName) setName(initialName);
  }, [initialName]);

  useEffect(() => {
    if (initialPhone) setPhone(initialPhone);
  }, [initialPhone]);

  useEffect(() => {
    if (initialIssue) setIssue(initialIssue);
  }, [initialIssue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    // Simulate premium backend lead dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess({ name, phone, issue });
      }
    }, 1200);
  };

  return (
    <div id="quick-quote-form-container" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
      {/* Decorative Top Accent Bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-brand to-cyan-brand" />

      {submitted ? (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 scale-110 transition-transform">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-white">
            Dispatch Queue Confirmation!
          </h3>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
            Thank you, **{name}**. Your ticket has been logged into our rapid Sydney router. An on-call emergency plumber will contact you on <strong>{phone}</strong> within 15 minutes!
          </p>
          <div className="mt-6 flex flex-col gap-3 justify-center items-center">
            <a
              href="tel:+61468991817"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold font-display rounded-xl shadow-md transition-colors w-full sm:w-auto justify-center"
            >
              <Wrench className="w-4 h-4" />
              Call Joe Now for Instant updates
            </a>
            <button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setPhone("");
                setIssue("");
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-blue-550/10 dark:bg-blue-500/15 text-blue-brand dark:text-cyan-brand">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                Get a Free Quote
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% Upfront Pricing • No Hidden Fees
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="quote-name" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="quote-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liam Smith"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white text-sm focus:ring-2 focus:ring-blue-brand/20 focus:border-blue-brand outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="quote-phone" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="quote-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0468 991 817"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white text-sm focus:ring-2 focus:ring-blue-brand/20 focus:border-blue-brand outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="quote-issue" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Describe the Issue
              </label>
              <textarea
                id="quote-issue"
                rows={3}
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="e.g. Kitchen sink drains very slowly, bubbling noises, potential grease blockages."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white text-sm focus:ring-2 focus:ring-blue-brand/20 focus:border-blue-brand outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 justify-between bg-blue-50/50 dark:bg-slate-950/60 p-3 rounded-xl border border-blue-100/30 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              Licensed Plumbers • 100% Secure Info
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-brand hover:bg-blue-700 text-white font-semibold font-display rounded-xl tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Deploying Technician...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Request Priority Dispatch
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
