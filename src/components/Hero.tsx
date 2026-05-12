import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-black pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
          alt="Modern Architecture"
          className="w-full h-full object-cover opacity-50 select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-orange-500 text-xs font-bold uppercase tracking-[0.3em] mb-6 block">
              Precision Engineering & Construction
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] mb-8 pb-4">
              WE BUILD <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">FUTURE</span> LEGACIES.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 font-medium">
              Leading the industry in modern structural design and sustainable construction. MADECC delivers excellence through innovation and unwavering commitment.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#portfolio"
                className="group bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-orange-600 hover:text-white transition-all duration-500"
              >
                View Portfolio
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="px-10 py-5 text-sm font-bold uppercase tracking-widest text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                Our History
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Rail Text */}
      <div className="absolute bottom-20 right-[-100px] rotate-90 hidden lg:block">
        <span className="text-[140px] font-black text-white/5 whitespace-nowrap leading-none select-none">
          ENGINEERING EXCELLENCE 2026
        </span>
      </div>
    </section>
  );
}
