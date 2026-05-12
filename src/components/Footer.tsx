import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Facebook", href: "https://www.facebook.com/share/1Ayz1EGYj6/", icon: Facebook },
    { name: "WhatsApp", href: "https://wa.me/237683316486", icon: MessageCircle },
  ];

  return (
    <footer className="bg-black text-white py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/logo.png" 
                alt="MADECC Logo" 
                className="h-12 w-auto object-contain brightness-0 invert" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <h3 className="text-3xl font-bold tracking-tighter uppercase">MADECC_CONSTRUCTION</h3>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 italic">
              Pioneering architectural boundaries and engineering innovation since 1998. Building the infrastructure of tomorrow with today's smartest solutions.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
               <Link to="/social" className="text-[10px] uppercase tracking-[0.2em] font-black text-white px-4 py-2 border border-white/10 hover:bg-white hover:text-black transition-all">
                 Unified Presence
               </Link>
               <div className="flex gap-4">
                 {socialLinks.map((s) => (
                   <a 
                     key={s.name} 
                     href={s.href} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-white/40 hover:text-orange-500 transition-colors"
                     aria-label={s.name}
                   >
                     <s.icon size={18} />
                   </a>
                 ))}
               </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-orange-500">Navigation</h4>
            <ul className="space-y-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/#services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/#portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Journal</Link></li>
              <li><Link to="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-orange-500">Ethics & Legal</h4>
            <ul className="space-y-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/admin" className="hover:text-orange-500 transition-colors border-t border-white/5 pt-4 inline-block w-full">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
            &copy; 2026 MADECC Construction Group. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
