import { motion } from "motion/react";
import { Instagram, Linkedin, Twitter, MessageCircle, MapPin, Globe, Facebook } from "lucide-react";

export default function SocialLanding() {
  const links = [
    { name: "Official Website", url: "/", icon: Globe },
    { name: "Facebook Official", url: "https://www.facebook.com/share/1Ayz1EGYj6/", icon: Facebook },
    { name: "Instagram Showcase", url: "#", icon: Instagram },
    { name: "LinkedIn Professional", url: "#", icon: Linkedin },
    { name: "Industry Updates (X)", url: "#", icon: Twitter },
    { name: "Direct WhatsApp", url: "https://wa.me/237683316486", icon: MessageCircle },
    { name: "Our Headquarters", url: "https://maps.app.goo.gl/wbHUNHdpcEagX8of9", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-12"
      >
        <div className="w-24 h-24 bg-white text-black flex items-center justify-center mx-auto mb-6">
           <span className="text-2xl font-black">M</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2">MADECC Construction</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Engineering Excellence Every Day</p>
      </motion.div>

      <div className="w-full max-w-md space-y-4">
        {links.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between w-full p-5 bg-zinc-900 border border-white/10 hover:bg-white hover:text-black transition-all group"
          >
            <div className="flex items-center gap-4">
               <link.icon size={20} className="text-orange-500 group-hover:text-black" />
               <span className="text-xs font-bold uppercase tracking-widest">{link.name}</span>
            </div>
            <span className="text-gray-600 group-hover:text-black">→</span>
          </motion.a>
        ))}
      </div>

      <div className="mt-20">
         <p className="text-gray-700 text-[9px] font-bold uppercase tracking-[0.3em]">&copy; 2026 MADECC_CONSTRUCTION GROUP</p>
      </div>
    </div>
  );
}
