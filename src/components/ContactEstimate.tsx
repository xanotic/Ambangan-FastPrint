import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import ScrollFadeIn from "./ScrollFadeIn";

// Bridge to the shared front-end order store (public/afp.js, attached to window).
declare global {
  interface Window {
    AFP?: {
      createOrder: (data: unknown) => { id: string };
    };
  }
}

export default function ContactEstimate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Photostat Service",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  // Every service offered + an "Others" catch-all
  const projectTypes = [
    "Photostat Service",
    "Banner Printing",
    "Business Card Printing",
    "Rubber Stamp Production",
    "Name Tag Manufacturing",
    "Custom Printing Services",
    "Wedding Invitations",
    "Others",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }

    setIsSubmitting(true);

    // Create a commission request in the shared store → shows up in the staff dashboard.
    setTimeout(() => {
      let newId = "";
      try {
        if (window.AFP) {
          const order = window.AFP.createOrder({
            service: formData.projectType,
            specs: ["Request Type: Commission / Quote Request"],
            total: "Quote on review",
            customer: { name: formData.name, phone: formData.phone, email: formData.email },
            notes: formData.notes,
          });
          newId = order.id;
        }
      } catch {
        // store unavailable — still show success for the prototype
      }

      setIsSubmitting(false);
      setIsSent(true);
      setOrderId(newId);
      setFormData({ name: "", email: "", phone: "", projectType: "Photostat Service", notes: "" });
      setTimeout(() => setIsSent(false), 8000);
    }, 1200);
  };

  return (
    <section id="estimate" className="relative py-28 bg-[#07090e] border-t border-white/5">
      {/* Background radial highlight */}
      <div className="absolute bottom-0 left-1/2 w-[60%] h-[40%] bg-blue-500/5 rounded-full blur-[160px] -translate-x-1/2 -z-10" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <ScrollFadeIn delay={0}>
            <span className="text-[10px] tracking-[0.3em] font-semibold text-[#29b6d8] uppercase block">Get a Quote</span>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Request a Commission
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.2}>
            <p className="text-sm md:text-base text-white/60 font-sans leading-relaxed">
              Tell us what you need and our team will get back to you with a quote. Your request goes straight to our order desk.
            </p>
          </ScrollFadeIn>
        </div>

        {/* Commission Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="liquid-glass-strong p-8 md:p-12 rounded-[28px] border border-white/10"
        >
          {isSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#29b6d8]/10 border border-[#29b6d8]/30 text-[#29b6d8] flex items-center justify-center mx-auto mb-5">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">Request Received!</h3>
              <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto">
                Thank you. Your commission request has been logged and our team has been notified. We'll contact you with a quote shortly.
              </p>
              {orderId && (
                <div className="mt-5 inline-flex flex-col items-center gap-3">
                  <span className="font-mono text-lg font-bold text-[#29b6d8] bg-[#29b6d8]/10 border border-dashed border-[#29b6d8]/40 rounded-lg px-4 py-2">
                    {orderId}
                  </span>
                  <a
                    href={`track.html?id=${encodeURIComponent(orderId)}`}
                    className="text-xs text-[#7dd8f0] underline hover:text-[#29b6d8]"
                  >
                    Track this request →
                  </a>
                </div>
              )}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase tracking-widest text-[#7dd8f0] font-semibold">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Nabil Fauzi"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#29b6d8]/50 focus:ring-1 focus:ring-[#29b6d8]/30 transition-all duration-300 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase tracking-widest text-[#7dd8f0] font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. nabil@email.com"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#29b6d8]/50 focus:ring-1 focus:ring-[#29b6d8]/30 transition-all duration-300 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none"
                  />
                </div>
              </div>

              {/* Phone & Project Classification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase tracking-widest text-[#7dd8f0] font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 012-345 6789"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#29b6d8]/50 focus:ring-1 focus:ring-[#29b6d8]/30 transition-all duration-300 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase tracking-widest text-[#7dd8f0] font-semibold">Project Classification</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#29b6d8]/50 focus:ring-1 focus:ring-[#29b6d8]/30 transition-all duration-300 rounded-xl py-3.5 px-4 text-sm text-white outline-none appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1rem",
                      backgroundRepeat: "no-repeat",
                      paddingRight: "2.5rem",
                    }}
                  >
                    {projectTypes.map((t) => (
                      <option key={t} value={t} className="bg-[#0e1424] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Brief / Design Intent */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] uppercase tracking-widest text-[#7dd8f0] font-semibold">Brief / Design Intent</label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Describe what you need — quantity, size, colours, deadline, and anything else that helps us quote accurately."
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#29b6d8]/50 focus:ring-1 focus:ring-[#29b6d8]/30 transition-all duration-300 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none resize-none"
                />
              </div>

              {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#29b6d8] hover:bg-[#4ec8e4] text-black font-bold uppercase tracking-wider py-4 rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-[#29b6d8]/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Commission Request
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
}
