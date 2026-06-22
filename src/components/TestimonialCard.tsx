import { Star, ShieldCheck } from "lucide-react";
import { Testimonial } from "../types";

interface TestimonialCardProps {
  key?: string;
  review: Testimonial;
}

export default function TestimonialCard({ review }: TestimonialCardProps) {
  return (
    <div
      id={`testimonial-card-${review.id}`}
      className="relative flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
    >
      <div>
        {/* Rating Row & Verified Marker */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-4.5 h-4.5 fill-accent-amber text-accent-amber" />
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 font-sans tracking-wide bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Customer
          </span>
        </div>

        {/* Testimonial review quote */}
        <p className="italic text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6">
          “{review.text}”
        </p>
      </div>

      {/* Author details with local geographical details */}
      <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-brand dark:text-cyan-brand font-display font-black text-sm flex items-center justify-center">
          {review.author.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
            {review.author}
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {review.location}, Sydney • {review.date}
          </span>
        </div>
      </div>
    </div>
  );
}
