import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2070"
                alt="Construction Site Team"
                className="w-full aspect-square object-cover grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-600 hidden md:flex items-center justify-center p-8 text-white">
                <div>
                  <p className="text-5xl font-black mb-2">25+</p>
                  <p className="text-xs uppercase font-bold tracking-widest">Years of Structural Excellence in the Industry</p>
                </div>
              </div>
            </motion.div>
            <div className="absolute -top-10 -left-10 w-full h-full border-10 border-gray-100 -z-0" />
          </div>

          <div>
            <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-4 block">About MADECC</span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 uppercase leading-[0.9]">
              Engineering the <br /> <span className="text-orange-600 italic font-serif lowercase">extraordinary</span>.
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-12">
              <p>
                Founded on the principles of precision and integrity, MADECC Construction has grown from a regional contractor into a powerhouse of modern engineering.
              </p>
              <p>
                We specialize in vertical and horizontal construction projects that demand high technical capability. Our mission is to provide infrastructure that stands the test of time while respecting the environment.
              </p>
            </div>
            
            <a href="/about" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-black hover:text-orange-600 transition-colors">
              Read Our Full Story
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
