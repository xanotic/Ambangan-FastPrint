import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Layers, Award } from "lucide-react";

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for 3D tilt effect on the hero card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for card rotation
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);
  
  // Transform values for lighting reflection gloss
  const glossX = useTransform(x, [-300, 300], ["0%", "100%"]);
  const glossY = useTransform(y, [-300, 300], ["0%", "100%"]);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative min-h-screen pt-32 pb-24 flex items-center justify-center overflow-hidden bg-[#07090e]">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full glow-spot" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#b0c4de]/10 rounded-full glow-spot" />
      <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full glow-spot" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Text Content */}
        <div className="lg:col-span-7 text-left space-y-8">
          {/* Subtitle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#29b6d8]/10 border border-[#29b6d8]/30 text-xs font-semibold tracking-widest text-[#29b6d8] uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fast Turnaround • Premium Quality
          </motion.div>

          {/* Heading */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1]"
            >
              Where Speed Meets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29b6d8] via-[#7dd8f0] to-white italic">
                Masterful Print
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base md:text-lg text-white/60 font-sans max-w-xl leading-relaxed"
            >
              Ambangan Fast Print delivers high-speed precision printing with premium quality — from business cards and brochures to bespoke packaging, banners, and branded stationery.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="/services-photostat.html"
              className="bg-white hover:bg-white/95 text-black px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl shadow-white/5"
            >
              View Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#gallery"
              className="liquid-glass hover:bg-white/5 text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
            >
              View Studio Works
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-6 border-t border-white/5 flex flex-wrap gap-8 text-white/50 text-xs"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#29b6d8]/60" />
              <span>Fast Turnaround Printing</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#29b6d8]/60" />
              <span>Quality Guaranteed</span>
            </div>
          </motion.div>
        </div>

        {/* Cinematic Card Showcase (Right Column) */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative w-80 h-[480px] cursor-grab active:cursor-grabbing"
            style={{ perspective: 1000 }}
          >
            {/* Ambient Background Glow behind Card */}
            <div className="absolute inset-0 bg-[#b0c4de]/10 rounded-[28px] blur-2xl -z-10 animate-pulse-slow" />

            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY }}
              className="w-full h-full liquid-glass-strong rounded-[28px] p-8 flex flex-col justify-between select-none relative overflow-hidden border border-white/20"
            >
              {/* Dynamic Glare Reflection Overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                  background: `radial-gradient(circle at ${glossX} ${glossY}, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`
                }}
              />

              {/* Cotton Paper texture simulation overlay */}
              <div className="absolute inset-0 paper-grain opacity-10 pointer-events-none" />

              {/* Top Section */}
              <div className="space-y-1 z-10">
                <span className="text-[10px] tracking-[0.3em] font-semibold text-white/40 uppercase block">Wedding Invitation</span>
                <h3 className="font-serif text-3xl font-light text-white leading-tight italic">Aiman</h3>
                <h3 className="font-serif text-3xl font-light text-white leading-tight">&amp; Nurul</h3>
              </div>

              {/* Center Debossed Pattern */}
              <div className="my-auto flex justify-center items-center z-10">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center relative bg-gradient-to-br from-white/5 to-transparent">
                  <div className="w-18 h-18 rounded-full border border-white/10 flex items-center justify-center">
                    <span className="font-sans text-sm font-bold text-white/60 tracking-wider">AFP</span>
                  </div>
                  {/* Faux gold foil hot stamping overlay */}
                  <div className="absolute inset-0 rounded-full border border-[#d4af37]/30 bg-gradient-to-tr from-[#d4af37]/5 to-[#ffdf7a]/10 backdrop-blur-[2px]" />
                </div>
              </div>

              {/* Bottom Section */}
              <div className="space-y-4 z-10">
                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40">Paper Stock</p>
                    <p className="text-xs text-white/80 font-medium">Cotton White 600gsm</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-white/40">Finish</p>
                    <p className="text-xs text-[#d4af37] font-semibold">24K Gold Stamping</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[8px] text-white/30 tracking-widest uppercase">
                  <span>Serial No. 883-X</span>
                  <span>Ambangan studio</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
