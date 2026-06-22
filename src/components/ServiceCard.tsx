import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { PlumbingService } from "../types";

interface ServiceCardProps {
  key?: string;
  service: PlumbingService;
  onSelect: (service: PlumbingService) => void;
}

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  // Dynamically load the Lucide icon or fallback to Wrench
  const IconComponent = (Icons as any)[service.iconName] || Icons.Wrench;

  return (
    <motion.div
      id={`service-card-${service.id}`}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onSelect(service)}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between h-[390px]"
    >
      <div>
        {/* Top Image Banner */}
        {service.image ? (
          <div className="relative h-44 w-full overflow-hidden">
            <img
              src={service.image}
              alt={service.label}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
            
            {service.isEmergency && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono tracking-wider font-semibold uppercase bg-red-650 text-white rounded-full animate-pulse shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                24/7 Urgent
              </span>
            )}
          </div>
        ) : (
          <div className="relative h-44 w-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-950/20 dark:to-cyan-950/20 flex items-center justify-center">
            <IconComponent className="w-16 h-16 text-blue-brand/20 dark:text-cyan-brand/20" />
          </div>
        )}

        {/* Floating Offset Icon */}
        <div className="px-6 -mt-6 relative z-10">
          <div className="inline-flex p-3 rounded-xl bg-blue-brand dark:bg-slate-800 text-white dark:text-cyan-brand shadow-lg group-hover:scale-110 transition-transform duration-300">
            <IconComponent className="w-5 h-5" />
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 pt-4">
          <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-brand dark:group-hover:text-cyan-brand transition-colors duration-200">
            {service.label}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
            {service.desc}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-brand dark:text-cyan-brand font-display">
          <span>Request service</span>
          <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
        </div>
      </div>
    </motion.div>
  );
}
