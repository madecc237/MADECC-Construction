import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 pb-20">
        <header className="max-w-7xl mx-auto px-6 mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-10"
          >
            OUR <br /> REALITY.
          </motion.h1>
          <div className="h-2 w-32 bg-orange-600"></div>
        </header>

        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight italic font-serif">A Legacy Built on Trust and Concrete.</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At MADECC_CONSTRUCTION, we don't just see ourselves as builders. We see ourselves as partners in the progress of the regions we serve. With roots deep in structural engineering, we have evolved into a multi-disciplinary firm capable of tackling the most challenging architectural feats.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our team consists of over 200 dedicated professionals, including award-winning architects, master engineers, and precision craftsmen who share a single vision: building excellence.
            </p>
            <div className="pt-10 border-t border-gray-100">
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-600 mb-4">Governance & Integrity</h3>
               <p className="text-gray-500 text-sm leading-relaxed mb-6">
                 Under the strict guidance of our Chief Executive Officer, MADECC maintains a centralized command structure. Every administrative action, from financial auditing to document control, is vetted at the highest level. 
               </p>
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <p className="text-xs font-bold text-black uppercase tracking-widest mb-1">Fiscal Oversight</p>
                   <p className="text-[11px] text-gray-500 leading-tight">Our accounting team manages complex ledger systems and taxation yields to ensure fiscal transparency.</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-black uppercase tracking-widest mb-1">Administrative Control</p>
                   <p className="text-[11px] text-gray-500 leading-tight">The executive secretariat coordinates all legal archiving and administrative liaison for seamless site operations.</p>
                 </div>
               </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1541976590-713941fbc1c6?auto=format&fit=crop&q=80&w=2070" className="w-full h-64 object-cover grayscale" />
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" className="w-full h-64 object-cover grayscale" />
          </div>
        </section>

        <section className="py-32 bg-black text-white mt-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
              <div>
                <h3 className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-6">Our Mission</h3>
                <p className="text-xl text-gray-400">To provide vertical and horizontal construction solutions that define modern living and industrial efficiency.</p>
              </div>
              <div>
                <h3 className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-6">Our Vision</h3>
                <p className="text-xl text-gray-400">To be the most trusted name in infrastructure development across Africa, recognized for safety and innovation.</p>
              </div>
              <div>
                <h3 className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-6">Our Values</h3>
                <p className="text-xl text-gray-400">Integrity. Precision. Sustainability. We believe in building things that matter, the right way.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
