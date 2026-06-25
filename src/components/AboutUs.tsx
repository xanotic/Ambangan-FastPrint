import { motion } from "framer-motion";
import ScrollFadeIn from "./ScrollFadeIn";

export default function AboutUs() {
  const stats = [
    { value: "4.6★", label: "Google Rating", small: false },
    { value: "Bedong", label: "Sungai Petani, Kedah", small: false },
    { value: "6 Days", label: "Open Per Week", small: false },
    { value: "012-694 9147", label: "WhatsApp", small: true },
  ];

  return (
    <section
      id="about"
      className="relative py-28 bg-[#05070a] border-t border-white/5 overflow-hidden"
    >
      {/* Atmospheric Glow Effects */}
      <div className="absolute top-[-20%] left-[-5%] w-[55%] h-[55%] bg-[#29b6d8]/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <ScrollFadeIn delay={0}>
            <span className="text-[10px] tracking-[0.3em] font-semibold text-[#29b6d8] uppercase block">
              About Our Studio
            </span>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Crafted with Speed.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29b6d8] via-[#7dd8f0] to-white">
                Delivered with Pride.
              </span>
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.2}>
            <p className="text-sm md:text-base text-white/55 font-sans leading-relaxed">
              Ambangan Fast Print is a trusted printing and creative design studio owned by{" "}
              <span className="text-white/80 font-medium">
                FA Sinar Fajar Enterprise (AS0395296-D)
              </span>
              . We are passionate about turning your ideas into beautifully printed realities — quickly, affordably, and with exceptional quality.
            </p>
          </ScrollFadeIn>
        </div>

        {/* Stats Row */}
        <ScrollFadeIn delay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="text-center liquid-glass rounded-2xl py-8 px-4 border border-white/5 hover:border-[#29b6d8]/20 transition-colors duration-300 group"
            >
              <span className={`font-serif font-semibold text-white block group-hover:text-[#29b6d8] transition-colors duration-300 whitespace-nowrap ${stat.small ? "text-2xl md:text-[1.7rem]" : "text-4xl"}`}>
                {stat.value}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 block mt-2">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </ScrollFadeIn>

      </div>
    </section>
  );
}
