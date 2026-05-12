import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'invalid-email'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: 'Construction', message: '' });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setStatus('invalid-email');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", {
          status: response.status,
          statusText: response.statusText,
          contentType,
          bodySample: text.substring(0, 200)
        });
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}...`);
      }

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', service: 'Construction', message: '' });
      } else {
        setErrorMessage(data?.error || `Submission failed (Status ${response.status}). Please try again.`);
        setStatus('error');
      }
    } catch (error: any) {
      console.error("Submission error details:", error);
      if (error.message.includes("non-JSON")) {
        setErrorMessage("Deployment Link Broken: The contact API was not found. Please click 'Deploy' in Netlify to ensure your latest changes (including netlify.toml) are live.");
      } else if (error.name === 'AbortError') {
        setErrorMessage("Request timed out. Please try again.");
      } else {
        setErrorMessage(`Error: ${error.message || 'Network error or server unavailable.'}`);
      }
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-32 bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          <div className="flex flex-col">
            <span className="text-orange-500 font-bold uppercase tracking-[0.3em] mb-4 text-xs">Contact Us</span>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-none">LET'S BUILD <br /> SOMETHING GREAT.</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-md">
              Whether you have a specific project in mind or just want to explore possibilities, our team is ready to assist.
            </p>
            
            <div className="space-y-6 mb-12">
               <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Global HQ</p>
                  <a 
                    href="https://maps.app.goo.gl/wbHUNHdpcEagX8of9" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xl font-medium tracking-tight text-white hover:text-orange-500 transition-colors"
                  >
                    Yaounde, Carrefour Mbankolo
                  </a>
               </div>
               <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Inquiries</p>
                  <p className="text-xl font-medium tracking-tight text-white">+237 683-316-486 / madeccco5@gmail.com</p>
               </div>
               <div className="pt-8 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-2">Staff & Administration</p>
                  <p className="text-sm text-gray-500 leading-relaxed italic">
                    Personnel requiring internal terminal access keys must contact the Chief Executive Officer directly for multi-factor verification and issuance.
                  </p>
               </div>
            </div>

            {/* Google Maps Embed */}
            <div className="h-64 md:h-80 w-full rounded-2xl overflow-hidden grayscale contrast-125 opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-700 bg-zinc-900 border border-white/5">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15918.57795328!2d11.5!3d3.8667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309a7927%3A0x1234567890abcdef!2zM8KwNTInMDEuMiJOIDExwrAzMCcwMC4wIkU!5e0!3m2!1sen!2scm!4v1715344300000!5m2!1sen!2scm" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="filter invert hue-rotate-180"
              />
            </div>
          </div>

          <div className="bg-zinc-900 p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/10 blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-orange-600/20" />
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
                >
                  <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-600/40">
                     <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight uppercase italic">Transmission Received</h3>
                  <p className="text-gray-400 max-w-xs">Our team will review your proposal and initiate contact within 24 operational hours.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 px-8 py-3 border border-orange-600 text-xs font-bold uppercase tracking-widest text-orange-500 hover:bg-orange-600 hover:text-white transition-all"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group relative">
                      <input
                        type="text"
                        required
                        placeholder=" "
                        className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-orange-500 transition-colors peer"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                      <label className="absolute left-0 top-4 text-gray-500 uppercase tracking-widest text-xs font-bold transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-orange-500">
                        Full Name
                      </label>
                    </div>

                    <div className="group relative">
                      <input
                        type="email"
                        required
                        placeholder=" "
                        className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-orange-500 transition-colors peer"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                      <label className="absolute left-0 top-4 text-gray-500 uppercase tracking-widest text-xs font-bold transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-orange-500">
                        Email Address
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group relative">
                      <input
                        type="tel"
                        placeholder=" "
                        className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-orange-500 transition-colors peer"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <label className="absolute left-0 top-4 text-gray-500 uppercase tracking-widest text-xs font-bold transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-orange-500">
                        Phone Number
                      </label>
                    </div>

                    <div className="group relative">
                      <select
                        className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-orange-500 transition-colors text-white uppercase tracking-widest text-xs font-bold cursor-pointer"
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                      >
                        <option value="Construction" className="bg-zinc-900">General Construction</option>
                        <option value="Renovation" className="bg-zinc-900">Renovation & Remodel</option>
                        <option value="Civil Engineering" className="bg-zinc-900">Civil Engineering</option>
                        <option value="Consulting" className="bg-zinc-900">Project Consulting</option>
                        <option value="Public Works" className="bg-zinc-900">Public Works</option>
                      </select>
                      <label className="absolute left-0 -top-2 text-orange-500 uppercase tracking-widest text-[10px] font-bold">
                        Service Category
                      </label>
                    </div>
                  </div>

                  <div className="group relative">
                    <textarea
                      required
                      placeholder=" "
                      rows={4}
                      className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-orange-500 transition-colors peer resize-none"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                    <label className="absolute left-0 top-4 text-gray-500 uppercase tracking-widest text-xs font-bold transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-orange-500">
                      Project Specifications
                    </label>
                  </div>

                  <button
                    disabled={status === 'loading'}
                    className="w-full bg-orange-600 text-white font-black uppercase tracking-[0.2em] py-6 flex items-center justify-center gap-3 hover:bg-orange-700 transition-all disabled:opacity-50 relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10">{status === 'loading' ? 'Encrypting Data...' : 'Submit Request'}</span>
                    <Send size={18} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </button>
                  
                  {(status === 'error' || status === 'invalid-email') && (
                    <div className="flex items-start gap-2 text-red-500 text-[10px] font-bold uppercase leading-tight">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>
                        {status === 'invalid-email' ? 'Please enter a valid email address.' : errorMessage}
                      </span>
                    </div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
