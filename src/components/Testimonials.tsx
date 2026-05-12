import { motion } from "motion/react";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Jonathan Wright",
    role: "Director, Urban Dev Corp",
    content: "MADECC didn't just build our headquarters; they built a statement. Their attention to structural integrity and aesthetic detail is unmatched in the modern era.",
    avatar: "https://i.pravatar.cc/150?u=1"
  },
  {
    name: "Sarah Chen",
    role: "Chief Architect, ArcDesign",
    content: "Collaborating with MADECC on the Skyline project was seamless. They understand architectural vision and possess the technical prowess to execute complex geometries.",
    avatar: "https://i.pravatar.cc/150?u=2"
  },
  {
    name: "Marcus Thorne",
    role: "Gov. Infrastructure Lead",
    content: "Reliability is the cornerstone of our partnership. MADECC delivers on time, under budget, and with a level of precision that sets a new industry standard.",
    avatar: "https://i.pravatar.cc/150?u=3"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-20 text-center uppercase">Clients <span className="text-orange-600">&</span> Partners</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-10 relative shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-500"
            >
              <div className="absolute -top-6 left-10 w-12 h-12 bg-black flex items-center justify-center text-white ring-8 ring-gray-50">
                <Quote size={20} fill="currentColor" />
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed italic text-lg pt-4">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden grayscale">
                  <img src={t.avatar} alt={t.name} referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{t.name}</h4>
                  <p className="text-xs text-gray-400 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logo Strip Placeholder */}
        <div className="mt-32 flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale contrast-200">
           {['CORP', 'ARCH', 'CITY', 'METRO', 'ENG'].map(l => (
             <span key={l} className="text-3xl font-black tracking-widest">{l}</span>
           ))}
        </div>
      </div>
    </section>
  );
}
