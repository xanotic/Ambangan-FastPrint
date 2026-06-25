import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, Layers, Sliders, CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import ScrollFadeIn from "./ScrollFadeIn";

interface PaperOption {
  id: string;
  name: string;
  weight: string;
  bgColor: string;
  textColor: string;
  borderClass: string;
  priceModifier: number;
  description: string;
}

interface FinishOption {
  id: string;
  name: string;
  foilColor: string;
  priceModifier: number;
  description: string;
}

interface InkOption {
  id: string;
  name: string;
  colorHex: string;
  priceModifier: number;
  description: string;
}

export default function InteractiveConfigurator() {
  // Configurator selections
  const [selectedPaper, setSelectedPaper] = useState<string>("cotton-white");
  const [selectedFinish, setSelectedFinish] = useState<string>("gold-foil");
  const [selectedInk, setSelectedInk] = useState<string>("matte-black");
  const [quantity, setQuantity] = useState<number>(250);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  // Mouse move tilt effect hooks
  const configCardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [12, -12]);
  const rotateY = useTransform(x, [-200, 200], [-12, 12]);
  const glossX = useTransform(x, [-200, 200], ["0%", "100%"]);
  const glossY = useTransform(y, [-200, 200], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!configCardRef.current) return;
    const rect = configCardRef.current.getBoundingClientRect();
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

  // Data Options
  const paperOptions: PaperOption[] = [
    {
      id: "cotton-white",
      name: "German Cotton White",
      weight: "600 GSM",
      bgColor: "bg-white",
      textColor: "text-neutral-900",
      borderClass: "border-black/5",
      priceModifier: 0.0,
      description: "Extremely thick, heavy texture, and soft tactile feel. The standard for premium letterpress."
    },
    {
      id: "midnight-velvet",
      name: "Midnight Velvet Black",
      weight: "700 GSM",
      bgColor: "bg-[#090b0e]",
      textColor: "text-neutral-200",
      borderClass: "border-white/10",
      priceModifier: 0.4,
      description: "Ultra-dark, deep-black structural fiberboard. Exceptional for metallic gilding."
    },
    {
      id: "washi-sand",
      name: "Japanese Washi Sand",
      weight: "400 GSM",
      bgColor: "bg-[#e5dacf]",
      textColor: "text-neutral-800",
      borderClass: "border-[#caa885]/20",
      priceModifier: 0.6,
      description: "Organic mulberry fibers with gold-flake accents. A delicate, unique editorial look."
    },
    {
      id: "holographic-pearl",
      name: "Holographic Pearl Board",
      weight: "500 GSM",
      bgColor: "bg-gradient-to-tr from-[#eef2f3] via-[#ffdde1] to-[#eef2f3]",
      textColor: "text-indigo-950",
      borderClass: "border-indigo-200/40",
      priceModifier: 0.8,
      description: "Subtle pearlescent board reflecting full rainbow spectrums under light."
    }
  ];

  const finishOptions: FinishOption[] = [
    {
      id: "gold-foil",
      name: "24K Gold Stamping",
      foilColor: "bg-gradient-to-r from-[#d4af37] via-[#ffdf7a] to-[#aa7c11]",
      priceModifier: 0.5,
      description: "Metallic hot foil pressed into stock at 150°C, producing reflective debossed details."
    },
    {
      id: "debossing",
      name: "Blind Debossing",
      foilColor: "bg-[#1b212f]",
      priceModifier: 0.25,
      description: "No ink or foil. A clean indentation pressed into soft paper for architectural shadow details."
    },
    {
      id: "spot-uv",
      name: "Spot UV High Gloss",
      foilColor: "bg-gradient-to-r from-blue-300 to-indigo-400",
      priceModifier: 0.35,
      description: "Raised transparent liquid gloss layer that catches light on matte paper."
    },
    {
      id: "holographic-edge",
      name: "Holographic Edging",
      foilColor: "bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400",
      priceModifier: 0.7,
      description: "All edges of the card gilded with holographic metallic film, shining at every angle."
    }
  ];

  const inkOptions: InkOption[] = [
    {
      id: "matte-black",
      name: "Pantone Matte Black",
      colorHex: "#000000",
      priceModifier: 0.0,
      description: "Pure oil-based organic black ink for high-contrast letterpress."
    },
    {
      id: "metallic-bronze",
      name: "Pantone Metallic Bronze",
      colorHex: "#b58a5e",
      priceModifier: 0.15,
      description: "Shimmering copper-bronze ink with subtle metallic flake."
    },
    {
      id: "pure-white",
      name: "Opaque White Ink",
      colorHex: "#ffffff",
      priceModifier: 0.1,
      description: "Specially formulated heavy-bodied white ink for dark velvet cards."
    },
    {
      id: "blind",
      name: "No Ink (Blind Press)",
      colorHex: "transparent",
      priceModifier: -0.1,
      description: "Pressed purely with pressure, creating textured shadows."
    }
  ];

  // Calculations
  const activePaper = paperOptions.find((p) => p.id === selectedPaper) || paperOptions[0];
  const activeFinish = finishOptions.find((f) => f.id === selectedFinish) || finishOptions[0];
  const activeInk = inkOptions.find((i) => i.id === selectedInk) || inkOptions[0];

  const basePricePerCard = 1.25;
  const unitPrice = basePricePerCard + activePaper.priceModifier + activeFinish.priceModifier + activeInk.priceModifier;
  const totalPrice = unitPrice * quantity;

  // Handle CTA Order Submission
  const handleOrder = () => {
    setIsOrdering(true);
    // Fire elegant gold/silver confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#d4af37", "#f3e5ab", "#ffffff", "#b0c4de"],
    });

    setTimeout(() => {
      setIsOrdering(false);
    }, 3000);
  };

  return (
    <section id="configurator" className="relative py-28 bg-[#0a0e1a] border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 w-[70%] h-[50%] bg-[#b0c4de]/5 rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2 -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <ScrollFadeIn delay={0}>
            <span className="text-[10px] tracking-[0.3em] font-semibold text-white/50 uppercase block">Interactive Builder</span>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Configure Your Print Craft
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.2}>
            <p className="text-sm md:text-base text-white/60 font-sans leading-relaxed">
              Specify paper fibers, hot foil metallurgy, and typography ink. Watch the tactile preview react dynamically to simulated atmospheric illumination.
            </p>
          </ScrollFadeIn>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: 3D interactive preview of card */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center lg:sticky lg:top-32 py-10 lg:py-0">
            
            <div className="relative w-full max-w-[420px] aspect-[1.65/1] cursor-grab active:cursor-grabbing" style={{ perspective: 1000 }}>
              {/* Floating glow ring behind the card */}
              <div className={`absolute inset-[-4px] rounded-[18px] bg-gradient-to-tr from-white/10 to-transparent blur-md transition-all duration-500 ${
                selectedFinish === "holographic-edge" ? "from-pink-500/20 via-purple-500/10 to-cyan-500/20" : ""
              }`} />

              <motion.div
                ref={configCardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY }}
                className={`w-full h-full rounded-[16px] p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 border ${
                  activePaper.bgColor
                } ${activePaper.borderClass}`}
              >
                {/* Micro Paper texture */}
                <div className="absolute inset-0 paper-grain opacity-[0.14] pointer-events-none" />

                {/* Simulated Gloss/Glare light reflection overlay */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                  style={{
                    background: `radial-gradient(circle at ${glossX} ${glossY}, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 50%)`
                  }}
                />

                {/* Card Top Section: Brand Name (Foil/Ink dynamic style) */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <h4 className={`font-serif text-2xl tracking-wide font-medium leading-none ${activePaper.textColor}`}>
                      AETHERIA
                    </h4>
                    <span className={`text-[8px] uppercase tracking-[0.25em] opacity-60 block mt-1 ${activePaper.textColor}`}>
                      Design Studio
                    </span>
                  </div>
                  <span className={`text-[9px] font-sans opacity-55 border px-1.5 py-0.5 rounded ${
                    activePaper.textColor === "text-neutral-900" ? "border-neutral-900/20" : "border-white/20"
                  }`}>
                    {activePaper.weight}
                  </span>
                </div>

                {/* Card Center: Finishes & Embossing simulation */}
                <div className="my-auto flex justify-center items-center z-10 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedFinish + selectedPaper}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center relative border border-dashed border-current/20"
                    >
                      {/* Logo seal inside the circle */}
                      <span className={`font-serif text-base font-light italic ${activePaper.textColor}`}>Æ</span>
                      
                      {/* Finish effect visuals */}
                      {selectedFinish === "gold-foil" && (
                        <div className="absolute inset-[-2px] rounded-full border border-[#d4af37] bg-gradient-to-tr from-[#d4af37]/10 via-[#ffdf7a]/20 to-[#aa7c11]/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
                      )}
                      
                      {selectedFinish === "debossing" && (
                        <div className="absolute inset-[-1px] rounded-full border border-black/15 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.25),_inset_-1px_-1px_3px_rgba(255,255,255,0.3)] bg-transparent" />
                      )}

                      {selectedFinish === "spot-uv" && (
                        <div className="absolute inset-[-2px] rounded-full border border-white/40 bg-white/5 backdrop-blur-[1.5px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
                      )}

                      {selectedFinish === "holographic-edge" && (
                        <div className="absolute inset-[-2px] rounded-full border border-pink-400/50 bg-gradient-to-tr from-pink-500/10 via-purple-500/20 to-cyan-500/10 shadow-[0_0_15px_rgba(236,72,153,0.2)]" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Card Bottom Section */}
                <div className="flex justify-between items-end z-10 border-t border-current/10 pt-3">
                  <div>
                    <p className={`text-[8px] uppercase tracking-widest opacity-60 ${activePaper.textColor}`}>Studio Principal</p>
                    <p className={`text-xs font-semibold ${activePaper.textColor}`}>Elian Kaelen</p>
                  </div>
                  
                  {/* Dynamic Ink Color spot */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeInk.colorHex === "transparent" ? "rgba(0,0,0,0.15)" : activeInk.colorHex }} />
                    <p className={`text-[9px] font-medium opacity-65 ${activePaper.textColor}`}>
                      {activeInk.name.split(" ")[1] || "None"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Configurator Specifications Display */}
            <div className="mt-8 text-center text-xs text-white/40 space-y-1">
              <p>Active Selection: {activePaper.name} • {activeFinish.name} • {activeInk.name}</p>
              <p>Hover and move your mouse to tilt card & preview the light reflection.</p>
            </div>
          </div>

          {/* RIGHT: Selection Panel controls */}
          <div className="lg:col-span-6 space-y-8 liquid-glass p-8 rounded-[24px] border border-white/10 bg-[#0e1424]/40">
            
            {/* Step 1: Paper Stock */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-[#b0c4de] font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4" />
                1. Select Premium Paper Stock
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paperOptions.map((paper) => (
                  <button
                    key={paper.id}
                    onClick={() => setSelectedPaper(paper.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 ${
                      selectedPaper === paper.id
                        ? "bg-white/10 border-white/40 ring-1 ring-white/20"
                        : "bg-white/5 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border border-white/25 flex-shrink-0 ${paper.bgColor}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white leading-tight truncate">{paper.name}</p>
                      <p className="text-[10px] text-white/50 mt-0.5">{paper.weight}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 leading-relaxed italic">{activePaper.description}</p>
            </div>

            {/* Step 2: Finishes */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-[#b0c4de] font-semibold flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                2. Choose Premium Finish
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {finishOptions.map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => setSelectedFinish(finish.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 ${
                      selectedFinish === finish.id
                        ? "bg-white/10 border-white/40 ring-1 ring-white/20"
                        : "bg-white/5 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${finish.foilColor}`}>
                      {selectedFinish === finish.id && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white leading-tight truncate">{finish.name}</p>
                      <p className="text-[10px] text-white/50 mt-0.5">+{finish.priceModifier > 0 ? `$${finish.priceModifier.toFixed(2)}` : "Free"} / card</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 leading-relaxed italic">{activeFinish.description}</p>
            </div>

            {/* Step 3: Ink Selector */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-[#b0c4de] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                3. Choose Letterpress Ink Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {inkOptions.map((ink) => (
                  <button
                    key={ink.id}
                    onClick={() => setSelectedInk(ink.id)}
                    className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                      selectedInk === ink.id
                        ? "bg-white/10 border-white/40"
                        : "bg-white/5 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full mx-auto mb-2 border border-white/20"
                      style={{
                        backgroundColor: ink.colorHex === "transparent" ? "transparent" : ink.colorHex,
                        backgroundImage: ink.colorHex === "transparent" ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)" : "none",
                        backgroundSize: "6px 6px"
                      }}
                    />
                    <p className="text-[10px] font-semibold text-white leading-none truncate">{ink.name.split(" ")[1] || "None"}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Run Size Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs uppercase tracking-widest text-[#b0c4de] font-semibold">
                <span>4. Select Run Quantity</span>
                <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{quantity} cards</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>100</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </div>

            {/* Pricing Summary & Checkout */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-white/50">Unit Price</p>
                  <p className="text-sm font-semibold text-white font-mono">${unitPrice.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50">Estimated Total</p>
                  <p className="text-2xl font-serif font-bold text-white font-mono">${totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Success notification panel when ordering */}
              <AnimatePresence>
                {isOrdering && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-3 bg-white/5 border border-white/10 text-xs text-center rounded-xl text-white flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Custom sample order initialized. Redirecting...
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleOrder}
                disabled={isOrdering}
                className="w-full bg-white hover:bg-white/95 text-black font-bold uppercase tracking-wider py-4 rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-white/5"
              >
                <ShoppingBag className="w-4 h-4" />
                Initialize Custom Spec Run
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
