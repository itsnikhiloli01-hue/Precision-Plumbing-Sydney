import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Wrench,
  Droplets,
  Flame,
  Shield,
  Star,
  MapPin,
  Sparkles,
  Menu,
  X,
  PhoneCall,
  Hammer,
  AlertTriangle,
  MessageCircle,
  HelpCircle,
  Award,
  ChevronRight
} from "lucide-react";

import ThemeToggle from "./components/ThemeToggle";
import ServiceCard from "./components/ServiceCard";
import TestimonialCard from "./components/TestimonialCard";
import QuoteForm from "./components/QuoteForm";
import PlumbingAIChat from "./components/PlumbingAIChat";
import { LeadContext, PlumbingService, Testimonial } from "./types";

// Static service catalog
const SERVICES_DATA: PlumbingService[] = [
  {
    id: "emerg",
    label: "Emergency Plumbing (24/7)",
    desc: "Pipe bursts, severe water leakages, structural flooding, gas plumbing leaks, and structural drainage blocks. Fast dispatch of emergency technician in Sydney.",
    iconName: "Flame",
    isEmergency: true,
    image: "/src/assets/images/plumbing_hero_banner_1782139177157.jpg"
  },
  {
    id: "block",
    label: "Blocked Drains & Sewer Repairs",
    desc: "Complete clearing of sewer systems, blocked toilets, stormwater overflows using professional camera logging and root-cutting equipment.",
    iconName: "Droplets",
    image: "/src/assets/images/blocked_drains_sewer_1782140439798.jpg"
  },
  {
    id: "leak",
    label: "Leak Detection & Pipe Repairs",
    desc: "Pinpoint accuracy in locating concealed plumbing leaks under concrete walls and garden beds using advanced acoustic imaging and tracer gas.",
    iconName: "Wrench",
    image: "/src/assets/images/leak_detection_thumb_1782139195656.jpg"
  },
  {
    id: "hotwater",
    label: "Hot Water Installation & Repair",
    desc: "Hot water heater diagnostics, element replacements, thermostat tuneups, or single-day replacement of brand new efficient storage cylinders.",
    iconName: "Flame",
    image: "/src/assets/images/hot_water_repair_1782139211153.jpg"
  },
  {
    id: "bkitchen",
    label: "Bathroom & Kitchen Plumbing",
    desc: "Professional sink assembly, luxury tapware fittings, new toilet installations, water filtration lines, and kitchen remodeling layouts.",
    iconName: "Wrench",
    image: "/src/assets/images/bathroom_kitchen_install_1782140458588.jpg"
  },
  {
    id: "cleaning",
    label: "High-Pressure Drain Jetting",
    desc: "Jet blasting tree roots and grease deposits, cleaning drains cleanly, restoring critical flow capacities without damaging older clay pipes.",
    iconName: "Droplets",
    image: "/src/assets/images/drain_jetting_clearing_1782140474063.jpg"
  },
  {
    id: "newinstall",
    label: "New Installations",
    desc: "Full pre-piping and water delivery systems planning and execution for new residential buildings, residential homes, and commercial units.",
    iconName: "Wrench",
    image: "/src/assets/images/new_plumbing_install_1782140489749.jpg"
  },
  {
    id: "maint",
    label: "Maintenance & Roof Plumbing",
    desc: "Proactive storm drain inspection, industrial gutter systems maintenance, residential roof leak tracking, backflow compliance testing.",
    iconName: "Shield",
    image: "/src/assets/images/maintenance_roof_plumbing_1782140509223.jpg"
  }
];

// Verified 5-star testimonials
const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "review-1",
    author: "Liam H.",
    text: "Quick response and fixed my blocked drain fast. Joe came out within 30 minutes of our call. Incredible professional gear, upfront quotes, and zero mess left behind. Best Sydney plumbers!",
    rating: 5,
    date: "2 days ago",
    location: "Surry Hills"
  },
  {
    id: "review-2",
    author: "Elena S.",
    text: "Very professional and honest pricing. I had general leak concerns under my kitchen counter floor. Joe traced the minor fitting leakage quickly and completed the repair fast. Clean work!",
    rating: 5,
    date: "1 week ago",
    location: "Randwick"
  },
  {
    id: "review-3",
    author: "Marcus T.",
    text: "Highly recommend Joe and the team. Our residential hot water heater failed on Sunday night. Precision Plumbing had a technician on-site by Monday morning with transparent option plans.",
    rating: 5,
    date: "3 weeks ago",
    location: "Chatswood"
  },
  {
    id: "review-4",
    author: "Rachael G.",
    text: "Clean, reliable, and on-time service. We booked standard maintenance drainage clearing on our garden sewage line. They even gave us complimentary tips for storm drain blockages.",
    rating: 5,
    date: "1 month ago",
    location: "Parramatta"
  }
];

export default function App() {
  // Shared lead prefill state synced between AI Chat and the intake Quote form
  const [leadContext, setLeadContext] = useState<LeadContext>({
    name: "",
    phone: "",
    issue: ""
  });
  const [urgencyState, setUrgencyState] = useState<"low" | "medium" | "emergency">("low");

  // General responsive navbar states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Synced notification states for success receipt
  const [showFormSubmittedAlert, setShowFormSubmittedAlert] = useState(false);

  // Sync state from plumbing interactive chat assistant
  const handleLeadContextUpdate = (updatedCtx: LeadContext, urgency: "low" | "medium" | "emergency") => {
    setLeadContext(updatedCtx);
    setUrgencyState(urgency);
  };

  // Clicking a service card pre-selects the issue and scrolls down to the quote form
  const handleSelectService = (service: PlumbingService) => {
    setLeadContext(prev => ({
      ...prev,
      issue: `Hi Joe, I would like to get a quote/inspection for: "${service.label}".`
    }));
    if (service.isEmergency) {
      setUrgencyState("emergency");
    } else {
      setUrgencyState("medium");
    }

    // Smooth scroll down to the quote form container
    const target = document.getElementById("quick-quote-form-container");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 font-sans relative pb-20">
      
      {/* 1. Global Urgent Header Bar */}
      <div className="bg-red-650 dark:bg-red-750 bg-red-600 text-white py-2 px-4 shadow-sm relative overflow-hidden select-none z-50 text-center text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span>🔴 24/7 NSW Plumbing Dispatch Hotline: Under 30 minute typical response in Sydney metro!</span>
        <a href="tel:+61468991817" className="font-extrabold hover:underline inline-flex items-center gap-1 ml-1 cursor-pointer">
          Call +61 468 991 817
        </a>
      </div>

      {/* 2. Primary Navigation Header */}
      <header className="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 z-40 transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo Layout */}
          <a href="#hero-section" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative w-11 h-11 rounded-xl bg-blue-brand text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/35 group-hover:scale-105 active:scale-95 transition-transform duration-200">
              <Wrench className="w-5.5 h-5.5 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <span className="block font-display text-xl font-bold tracking-tight text-navy-dark dark:text-white leading-none">
                Precision Plumbing <span className="text-blue-brand">Sydney</span>
              </span>
              <span className="block text-[9px] tracking-widest text-slate-400 font-mono mt-1 font-bold">
                NSW COMPLIANT • LICENSE #19284C
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links & Pulsing Availability Indicator */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-350">
              <a href="#services-section" className="hover:text-blue-brand dark:hover:text-cyan-brand transition-colors">Services</a>
              <a href="#about-section" className="hover:text-blue-brand dark:hover:text-cyan-brand transition-colors">About</a>
              <a href="#process-section" className="hover:text-blue-brand dark:hover:text-cyan-brand transition-colors">Our Process</a>
              <a href="#reviews-section" className="hover:text-blue-brand dark:hover:text-cyan-brand transition-colors">Testimonials</a>
              <a href="#contact-section" className="hover:text-blue-brand dark:hover:text-cyan-brand transition-colors">Contact</a>
            </nav>
            
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-full select-none">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Available 24/7 for Emergencies
            </div>
          </div>

          {/* Tech Controls, Ratings & Core CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Google Rating Badge */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <Star className="w-4 h-4 fill-accent-amber text-accent-amber" />
              <span className="text-xs font-black text-slate-800 dark:text-white">5.0</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                (35+ reviews)
              </span>
            </div>

            {/* Dark Mode toggle button */}
            <ThemeToggle />

            {/* Calling button CTA */}
            <a
              href="tel:+61468991817"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-brand hover:bg-blue-700 text-white text-xs font-bold font-display rounded-xl tracking-wide shadow-md transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              +61 468 991 817
            </a>
          </div>

          {/* Tablet & Mobile Buttons bar */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* 3. Mobile Responsive Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 overflow-hidden absolute w-full left-0 z-30"
          >
            <div className="px-5 py-6 space-y-4 flex flex-col">
              <a
                href="#services-section"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-705 dark:text-slate-205 font-bold hover:text-blue-brand text-sm"
              >
                Services
              </a>
              <a
                href="#about-section"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-705 dark:text-slate-205 font-bold hover:text-blue-brand text-sm"
              >
                About
              </a>
              <a
                href="#process-section"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-705 dark:text-slate-205 font-bold hover:text-blue-brand text-sm"
              >
                Our Process
              </a>
              <a
                href="#reviews-section"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-705 dark:text-slate-205 font-bold hover:text-blue-brand text-sm"
              >
                Reviews
              </a>
              <a
                href="#contact-section"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-705 dark:text-slate-205 font-bold hover:text-blue-brand text-sm"
              >
                Contact
              </a>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-accent-amber text-accent-amber" />
                  5.0 Rated Sydney Local Plumber
                </span>
              </div>

              <a
                href="tel:+61468991817"
                className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold font-display rounded-xl text-center text-sm shadow flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                Call Joe 24/7 Dispatch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. PREMIUM HERO ARCHITECTURE (With responsive layout and photorealistic backdrop) */}
      <section id="hero-section" className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden py-12 md:py-20 select-none">
        
        {/* Photorealistic plumbing graphic backdrop */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-sky-950/80 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-950/90 z-10" />
          <img
            src="/src/assets/images/plumbing_hero_banner_1782139177157.jpg"
            alt="Emergency Plumbing Repairs Sydney"
            className="w-full h-full object-cover grayscale opacity-45 dark:opacity-30 object-center"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Left: Headlines & Social proofing */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-brand dark:text-cyan-brand rounded-full text-xs font-bold uppercase tracking-wider mb-2 max-w-max mx-auto lg:mx-0 select-none border border-blue-100/10">
              <Star className="w-4 h-4 fill-accent-amber text-accent-amber" />
              5.0 Rating (35 Google Reviews)
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-white leading-tight">
              Fast & Reliable Plumbing Services in Sydney – 24/7 Emergency Support
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Blocked drains, leaks, hot water repairs & emergency plumbing you can trust. Talk with our team or chat with our automated advisor for instant scheduling.
            </p>

            {/* Core Action triggers */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="tel:+61468991817"
                className="w-full sm:w-auto px-8 py-4.5 bg-red-600 hover:bg-red-700 text-white font-extrabold font-display rounded-2xl tracking-wide text-sm shadow-xl shadow-red-650/10 hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2.5 animate-urgent"
              >
                <PhoneCall className="w-5 h-5 text-white active:scale-95" />
                Call Joe Now (24/7 Emergency)
              </a>

              <a
                href="#quick-quote-form-container"
                className="w-full sm:w-auto px-8 py-4.5 bg-white/10 hover:bg-white/15 dark:bg-slate-900 dark:hover:bg-slate-850 text-white font-bold font-display rounded-2xl text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                Get Free Quote
              </a>
            </div>

            {/* Trust Line */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-slate-400 text-xs">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent-amber text-accent-amber" />
                ))}
              </div>
              <span className="font-medium">
                📍 Trusted by 35+ Sydney customers – <strong>5.0 star rated</strong>
              </span>
            </div>
          </div>

          {/* Hero Right: Seamless Interactive AI Chat Companion Box */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-brand via-transparent to-cyan-brand opacity-30 blur-lg pointer-events-none" />
            <div className="relative bg-slate-900/90 dark:bg-slate-950/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-white shadow-2xl">
              <div className="flex items-center gap-2.5 mb-3 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-full bg-blue-brand text-white font-mono flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm">Precision Plumbing Chat</h3>
                  <p className="text-[10px] text-slate-400">Describe leaks, blocks to prefill booking form</p>
                </div>
              </div>
              <div className="text-center font-mono space-y-2 py-4">
                <p className="text-xs text-sky-200/95 font-semibold">
                  ⚡ Pre-configure your service with AI
                </p>
                <p className="text-[11px] text-slate-400">
                  Our assistant is floating below. Simply tap the chat bubble on the bottom right or describe items to prompt instant analysis.
                </p>
                <div className="pt-2 text-center">
                  <a
                    href="#quick-quote-form-container"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-brand font-bold hover:underline"
                  >
                    Or skip and view form manually <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TRUST BAR / COGNITIVE COAX */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center justify-center text-center">
            
            <div className="space-y-1">
              <Clock className="w-6 h-6 text-blue-brand dark:text-cyan-brand mx-auto mb-1.5" />
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-101">
                24/7 Service Available
              </h3>
              <p className="text-[10px] text-slate-500">Day or night dispatch</p>
            </div>

            <div className="space-y-1">
              <ShieldCheck className="w-6 h-6 text-blue-brand dark:text-cyan-brand mx-auto mb-1.5" />
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-101">
                Licensed & Insured
              </h3>
              <p className="text-[10px] text-slate-500">Complete Sydney compliance</p>
            </div>

            <div className="space-y-1">
              <Award className="w-6 h-6 text-blue-brand dark:text-cyan-brand mx-auto mb-1.5" />
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-101">
                Fast Response Time
              </h3>
              <p className="text-[10px] text-slate-500">Priority local routing</p>
            </div>

            <div className="space-y-1">
              <Wrench className="w-6 h-6 text-blue-brand dark:text-cyan-brand mx-auto mb-1.5" />
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-101">
                Upfront Pricing
              </h3>
              <p className="text-[10px] text-slate-500">No hidden shock extras</p>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <MapPin className="w-6 h-6 text-blue-brand dark:text-cyan-brand mx-auto mb-1.5" />
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-101">
                Sydney Local Experts
              </h3>
              <p className="text-[10px] text-slate-500">Proudly Australian owned</p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SERVICES GRID CATALOG SECTION */}
      <section id="services-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-[11px] font-mono tracking-widest font-extrabold text-blue-brand dark:text-cyan-brand uppercase bg-blue-500/10 px-3 py-1 rounded-full">
            OUR SPECIALTIES
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Professional Plumbing Services across Sydney NSW
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Click any service card to pre-load inputs into our booking queue below. Our interactive helper will help identify details to fast-track your dispatch ticket.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_DATA.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={handleSelectService}
            />
          ))}
        </div>
      </section>

      {/* 7. HIGH CONVERSION URGENT EMERGENCIES ZONE (Flashing elements) */}
      <section className="bg-red-600 dark:bg-red-750 text-white py-12 px-6 shadow-inner relative overflow-hidden select-none">
        
        {/* Dynamic diagonal stripes accent */}
        <div className="absolute inset-x-0 inset-y-0 opacity-5 bg-[repeating-linear-gradient(45deg,#000_0px,#000_20px,transparent_20px,transparent_40px)] pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-display text-2xl sm:text-3.5xl font-black text-white leading-none">
              Plumbing Emergency? We’re Available 24/7
            </h2>
            <p className="text-sm text-red-50 font-light leading-relaxed">
              Don’t let a leaking hot water system, burst line, or blocked toilet cause water damage to your property. We dispatch fully equipped plumbing vans with immediate response!
            </p>
          </div>

          <a
            href="tel:+61468991817"
            className="px-8 py-4 bg-white hover:bg-neutral-100 text-red-700 font-extrabold font-display uppercase tracking-wide rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5 text-red-600 animate-bounce" />
            Call Now Immediately
          </a>
        </div>
      </section>

      {/* 8. ILLUSTRATED PROCESS FLOW CARD */}
      <section id="process-section" className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-mono tracking-widest font-extrabold text-blue-brand dark:text-cyan-brand uppercase bg-blue-500/10 px-3 py-1 rounded-full">
              WORKFLOW
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              How Precision Plumbing Serves You
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Simple 4-step workflow designed to deliver rapid results, upfront pricing, and total peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="group relative p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative h-40 w-full overflow-hidden rounded-xl mb-4">
                <img
                  src="/src/assets/images/process_call_quote_1782140522066.jpg"
                  alt="Call or Request Quote"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <span className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-blue-brand text-white flex items-center justify-center font-display font-extrabold text-sm shadow-md">
                  1
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-slate-800 dark:text-white mb-2">
                Call or Request Quote
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect on +61 468 991 817 or drop details here. Our AI system route schedules your ticket in real-time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative h-40 w-full overflow-hidden rounded-xl mb-4">
                <img
                  src="/src/assets/images/process_inspect_diagnose_1782140536361.jpg"
                  alt="Inspection & Diagnosis"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <span className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-blue-brand text-white flex items-center justify-center font-display font-extrabold text-sm shadow-md">
                  2
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-slate-800 dark:text-white mb-2">
                Inspection & Diagnosis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Our Sydney local plumber inspects on-site, explains issues clearly, and lists upfront pricing plans.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative h-40 w-full overflow-hidden rounded-xl mb-4">
                <img
                  src="/src/assets/images/process_repair_install_1782140550918.jpg"
                  alt="Repair & Installation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <span className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-blue-brand text-white flex items-center justify-center font-display font-extrabold text-sm shadow-md">
                  3
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-slate-800 dark:text-white mb-2">
                Repair & Installation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We perform precise plumbing work using professional Grade-A materials and compliance workmanship.
              </p>
            </div>

            {/* Step 4 */}
            <div className="group relative p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative h-40 w-full overflow-hidden rounded-xl mb-4">
                <img
                  src="/src/assets/images/process_testing_complete_1782140571936.jpg"
                  alt="Testing & Completion"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <span className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-blue-brand text-white flex items-center justify-center font-display font-extrabold text-sm shadow-md">
                  4
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-slate-800 dark:text-white mb-2">
                Testing & Completion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Complete flow diagnostic testing is conducted to verify repairs before cleanly leaving your home.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 9. SUBSTANTIAL ABOUT BRAND SECTION */}
      <section id="about-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-[11px] font-mono tracking-widest font-extrabold text-blue-brand dark:text-cyan-brand uppercase bg-blue-500/10 px-3 py-1 rounded-full">
              ABOUT OUR COMPANY
            </span>
            <h2 className="font-display text-2xl sm:text-3.5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Sydney’s First Choice for Quality, Urgent Plumbing Support
            </h2>
            
            <p className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed">
              Precision Plumbing Sydney NSW provides fast, reliable, and professional plumbing services across Sydney. Known for honesty, clean workmanship, and rapid emergency response, we pride ourselves on protecting your home and workplace from catastrophic water issues.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-500/10 text-blue-brand mt-1 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Experienced Sydney Technicians</h4>
                  <p className="text-xs text-slate-500">Fully qualified, licensed, and registered plumbers with decades of combined experience.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-500/10 text-blue-brand mt-1 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Transparent, Upfront Flat Rates</h4>
                  <p className="text-xs text-slate-500">Written pre-job quotes are delivered before any pipe repair or installation begins.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-500/10 text-blue-brand mt-1 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Respectful & Clean Workmanship</h4>
                  <p className="text-xs text-slate-500">We wear floor protectors, clean up debris fully, and leave your home spotless.</p>
                </div>
              </div>
            </div>
          </div>

          {/* About graphic layout displaying premium services visual */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[420px] max-w-md mx-auto w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent z-10" />
            <img
              src="/src/assets/images/hot_water_repair_1782139211153.jpg"
              alt="Professional plumbing copper install"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 inset-x-6 z-20 text-white p-6 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="flex items-center gap-1 text-accent-amber mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 fill-accent-amber text-accent-amber" />
                ))}
              </div>
              <p className="italic text-xs font-light leading-relaxed">
                “Outstanding service when my hot water service broke. Joe worked fast, charged fairly, and did exceptionally tidy work.”
              </p>
              <h4 className="font-bold text-[11px] uppercase tracking-wide text-sky-200 mt-2">
                — Thomas G., Sydney Suburbs
              </h4>
            </div>
          </div>

        </div>
      </section>

      {/* 10. TESTIMONIALS & REVIEWS SECTION */}
      <section id="reviews-section" className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-mono tracking-widest font-extrabold text-blue-brand dark:text-cyan-brand uppercase bg-blue-500/10 px-3 py-1 rounded-full">
              REVIEWS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white justify-center">
              What Sydney Customers Are Saying
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              We maintain a solid 5.0 Google Reviews score because we care about delivering honest workmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS_DATA.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>

        </div>
      </section>

      {/* 11. LEAD INTAKE AND MAP CONTACT SYSTEM */}
      <section id="contact-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Left: Quote Form */}
          <div className="lg:col-span-7 space-y-4">
            <QuoteForm
              initialName={leadContext.name}
              initialPhone={leadContext.phone}
              initialIssue={leadContext.issue}
              onSubmitSuccess={(data) => {
                setShowFormSubmittedAlert(true);
              }}
            />
          </div>

          {/* Contact Right: Detail deck and map embed */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-display text-lg font-bold text-slate-850 dark:text-white">
                Contact Details
              </h3>

              <div className="space-y-3.5">
                <a
                  href="tel:+61468991817"
                  className="flex items-center gap-3.5 text-sm font-semibold text-slate-700 dark:text-slate-350 hover:text-blue-brand transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-blue-100/50 dark:bg-slate-800 text-blue-brand">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-medium leading-none mb-1">On-Call Phone</span>
                    +61 468 991 817
                  </div>
                </a>

                <div className="flex items-center gap-3.5 text-sm text-slate-700 dark:text-slate-350">
                  <div className="p-2.5 rounded-xl bg-blue-100/50 dark:bg-slate-800 text-blue-brand">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-medium leading-none mb-1">Headquarters</span>
                    Sydney, New South Wales, Australia
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-sm text-slate-700 dark:text-slate-350">
                  <div className="p-2.5 rounded-xl bg-blue-100/50 dark:bg-slate-800 text-blue-brand">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-medium leading-none mb-1">Open Calendar</span>
                    24 Hours / 7 Days (Every Day)
                  </div>
                </div>
              </div>

              {/* Dynamic WhatsApp integration trigger */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href="https://wa.me/61468991817?text=Hi%20Precision%20Plumbing%20Sydney%20NSW%2C%20I%20have%20an%20urgent%20leak%20issue..."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-display rounded-2xl inline-flex items-center justify-center gap-2 text-xs shadow-md shadow-emerald-500/10 transition-colors"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  WhatsApp Direct Chat
                </a>
              </div>
            </div>

            {/* Google Maps iFrame integration container */}
            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm h-64 relative bg-slate-100">
              <iframe
                title="Precision Plumbing Sydney NSW service coordinates Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106013.91427503708!2d151.10815124976722!3d-33.868819875141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f37d743a%3A0x3017d681632a850!2sSydney%20NSW!5e0!3m2!1sen!2sau!4v1719000000000!5m2!1sen!2sau"
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

        </div>
      </section>

      {/* 12. IMMERSIVE COMPACT FOOTER */}
      <footer className="border-t border-navy-dark/20 dark:border-slate-900 bg-navy-dark text-slate-300 dark:bg-slate-950/95 py-12 transition-colors select-none">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-brand text-white flex items-center justify-center font-bold text-sm shadow-md">
                PP
              </div>
              <span className="font-display font-black text-white tracking-wide text-sm">
                PRECISION PLUMBING
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed max-w-sm">
              Highly trusted licensed and insured family team delivering transparent upfront pricing diagnostics in Sydney NSW. Clean workmanship guaranteed.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-3">
              Emergency Services
            </h4>
            <ul className="text-xs space-y-2 text-slate-300">
              <li>• Blocked Sewers & Toilets</li>
              <li>• Emergency Water Leakages</li>
              <li>• Stormwater Drainage Clearing</li>
              <li>• Pipe Blast & Drain Camera</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-3">
              Standard Services
            </h4>
            <ul className="text-xs space-y-2 text-slate-300">
              <li>• Hot Water Replacements</li>
              <li>• Tapware & Vanity Fits</li>
              <li>• Acoustic Leak Testing</li>
              <li>• Proactive Gutter Clearing</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-3">
              Availability Hours
            </h4>
            <ul className="text-xs space-y-2 text-slate-300">
              <li>🕒 Available 24 Hours / 7 Days</li>
              <li>📞 Emergency Dispatch Desk: <strong className="text-white">+61 468 991 817</strong></li>
              <li>📍 Sydney Metro, Coastal & NSW West</li>
            </ul>
          </div>

        </div>

        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-8 mt-8 border-t border-slate-700/55 dark:border-slate-800 text-center text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Precision Plumbing Sydney NSW. All Rights Reserved. Licensed Plumber NSW.</span>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Lic No: 345678C</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* 13. STICKY MOBILE CALL BANNER/URGENT CTA BAR & FLOATING AI DOCK */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-md py-3.5 px-4 z-40 border-t border-slate-800 md:hidden flex items-center justify-between select-none shadow-xl">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-full bg-red-500/15 text-red-400 animate-pulse">
            <PhoneCall className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 leading-none mb-0.5">NEED EMERGENCY RESPONSE?</span>
            <span className="block text-xs font-black text-white leading-none">Joe Is Active Now</span>
          </div>
        </div>

        <a
          href="tel:+61468991817"
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase font-display rounded-xl shadow-lg border border-red-500/20 active:scale-95 transition-transform"
        >
          Call Plumber 24/7
        </a>
      </div>

      {/* Connected Interactive AI chat assistant overlay bubble */}
      <PlumbingAIChat
        leadContext={leadContext}
        urgencyState={urgencyState}
        onLeadContextChange={handleLeadContextUpdate}
      />
      
    </div>
  );
}
