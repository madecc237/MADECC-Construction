import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { useContent } from "../context/ContentContext";

export default function Portfolio() {
  const { content } = useContent();
  const PROJECTS = content.filter(item => item.type === 'project' && item.status === 'Published');
  const [visibleCount, setVisibleCount] = useState(4);
  const isAllLoaded = visibleCount >= PROJECTS.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 2, PROJECTS.length));
  };

  return (
    <section id="portfolio" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 italic font-serif">Featured Projects</h2>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold border-l-2 border-orange-500 pl-4">
              01 / SHOWCASING OUR BEST WORK
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-gray-400 text-sm max-w-xs text-right">
              Explore our diverse range of engineering marvels and architectural landmarks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 border border-gray-100">
          <AnimatePresence>
            {PROJECTS.slice(0, visibleCount).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white overflow-hidden aspect-[4/3] cursor-pointer"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-in-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Overlay with details */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10 text-white">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 block text-orange-500">
                      {project.category}
                    </span>
                    <h3 className="text-3xl font-bold tracking-tight mb-4 uppercase">{project.title}</h3>
                    <p className="text-sm text-gray-300 max-w-sm leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <div className="w-10 h-px bg-orange-500 group-hover:w-20 transition-all duration-700"></div>
                  </motion.div>
                </div>

                {/* Counter Label */}
                <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <div className="w-14 h-14 bg-white text-black flex items-center justify-center text-sm font-black italic">
                      0{project.id}
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!isAllLoaded && (
          <div className="mt-20 flex justify-center">
            <button 
              onClick={loadMore}
              className="group flex flex-col items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-gray-400 hover:text-black transition-colors"
            >
              <span>Discover More</span>
              <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white transition-all duration-500">
                <Plus size={20} />
              </div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

