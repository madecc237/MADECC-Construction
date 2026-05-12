import { motion } from "motion/react";
import { HardHat, Ruler, Building, Truck, ShieldCheck, Drill } from "lucide-react";

const SERVICES = [
  {
    title: "Civil Engineering",
    description: "Complex structural solutions for sustainable urban environments and massive infrastructure projects.",
    icon: Ruler,
  },
  {
    title: "General Construction",
    description: "High-precision building services for commercial, industrial, and high-end residential sectors.",
    icon: Building,
  },
  {
    title: "Industrial Design",
    description: "Designing efficient, scalable industrial facilities that optimize workflow and energy consumption.",
    icon: HardHat,
  },
  {
    title: "Project Management",
    description: "End-to-end oversight ensuring projects are delivered on time, within budget, and above standard.",
    icon: ShieldCheck,
  },
  {
    title: "Logistics & Supply",
    description: "Strategic material sourcing and heavy equipment deployment across the Central African region.",
    icon: Truck,
  },
  {
    title: "Renovation & Retrofit",
    description: "Transforming aging structures into modern, energy-efficient landmarks with heritage preservation.",
    icon: Drill,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-4 block">Specialized Solutions</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 italic font-serif">Our Expertise</h2>
          <div className="h-1 w-24 bg-black"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
          {SERVICES.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-12 group hover:bg-black transition-colors duration-500"
            >
              <service.icon size={40} className="text-orange-600 mb-8 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-white transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
