import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { motion } from "motion/react";

export default function BlogPage() {
  const posts = [
    { title: "Building in Tropical Climates: Challenges & Solutions", category: "Engineering" },
    { title: "The Rise of Modular Construction in Commercial Real Estate", category: "Trends" },
    { title: "Standardizing Safety: Our 2026 OSHA Compliance Report", category: "Policy" },
    { title: "The Aesthetics of Brutalism in Modern Warehousing", category: "Design" },
    { title: "Infrastructure as Art: The Philosophy of Civil Works", category: "Philosophy" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-20 text-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6">THE JOURNAL</h1>
            <p className="text-gray-500 uppercase tracking-widest font-bold text-xs">Thoughts on engineering, design, and industry shifts.</p>
          </header>

          <div className="grid grid-cols-1 gap-px bg-gray-100 border border-gray-100">
            {posts.map((post, index) => (
              <motion.a 
                href="#" 
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white p-12 flex flex-col md:flex-row justify-between items-center group hover:bg-black transition-colors duration-500"
              >
                <div className="flex gap-10 items-center">
                   <span className="text-4xl font-serif italic text-gray-200 group-hover:text-gray-800 transition-colors">0{index + 1}</span>
                   <div>
                     <span className="text-orange-600 text-[10px] font-bold uppercase tracking-widest">{post.category}</span>
                     <h2 className="text-3xl font-bold tracking-tight group-hover:text-white transition-colors">{post.title}</h2>
                   </div>
                </div>
                <div className="mt-8 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center text-white">
                      →
                   </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
