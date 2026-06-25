import { ArrowRight } from "lucide-react";
import ScrollFadeIn from "./ScrollFadeIn";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string;
  badge: string;
  highlights: string[];
}

export default function ServicesShowcase() {
  const services: ServiceItem[] = [
    {
      id: "photostat",
      name: "Photostat Service",
      description: "High-speed document reproduction and scanning. Options for A4/A3 copier papers, color modes, and multi-style binding finishes.",
      url: "/services-photostat.html",
      image: "/photostate_service.jpeg",
      badge: "Fast Copier",
      highlights: ["A4 & A3 Copier", "B&W or Full Color", "Comb & Wire-O Binding"]
    },
    {
      id: "banner",
      name: "Banner Printing",
      description: "Large format tarpaulins and outdoor vinyl banners. Weatherproof materials, high-res ink, and custom accessories like PVC pipes or eyelets.",
      url: "/services-banner.html",
      image: "/banner_printing.jpeg",
      badge: "Wide Format",
      highlights: ["Up to 4x12 feet", "Heavy Duty Vinyl", "Brass Grommets & Pipes"]
    },
    {
      id: "business-card",
      name: "Business Card Printing",
      description: "Premium business cards that leave an impression. Keep our signature Letterpress styling with hot foil, spot UV, and luxury textured cotton stocks.",
      url: "/services-business-card.html",
      image: "/businesscard.jpg",
      badge: "Signature Craft",
      highlights: ["24K Gold Stamping", "600 GSM Cotton Paper", "Spot UV Gloss Finish"]
    },
    {
      id: "rubber-stamp",
      name: "Rubber Stamp Production",
      description: "Custom self-inking, wooden, and flash pre-inked stamps. Personalize names, addresses, or corporate seals in multiple ink colors.",
      url: "/services-rubber-stamp.html",
      image: "/rubberstamp.jpeg",
      badge: "Precision Seal",
      highlights: ["Pre-Inked Flash Stamp", "Self-Inking Mechanics", "Black, Blue & Red Ink"]
    },
    {
      id: "name-tag",
      name: "Name Tag Manufacturing",
      description: "Corporate and school name tags built to last. Premium acrylic, brushed metal brass, or epoxy dome with strong magnetic backings.",
      url: "/services-name-tag.html",
      image: "/nametag.png",
      badge: "Professional Identity",
      highlights: ["Brushed Gold/Silver", "Engraved Acrylic", "Magnetic Plate Backs"]
    },
    {
      id: "custom-print",
      name: "Custom Printing Services",
      description: "Bespoke marketing collateral, labels, and decals. Die-cut waterproof sticker sheets, flyers, booklets, and folded brochures.",
      url: "/services-custom.html",
      image: "/customservice.jpg",
      badge: "Fully Custom",
      highlights: ["Waterproof PP Stickers", "A5 & A4 Flyers", "Kiss-Cut Sticker Sheets"]
    }
  ];

  return (
    <section id="configurator" className="relative py-28 bg-[#0a0e1a] border-t border-white/5 overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[40%] bg-[#29b6d8]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[45%] h-[40%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <ScrollFadeIn delay={0}>
            <span className="text-[10px] tracking-[0.3em] font-semibold text-[#29b6d8] uppercase block">Apple-Style Configurator</span>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Select Your Print Craft
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.2}>
            <p className="text-sm md:text-base text-white/60 font-sans leading-relaxed">
              Explore our range of premium print solutions. Choose a service below to configure material weights, dimensions, luxury finishes, and order quantities in our interactive builder pages.
            </p>
          </ScrollFadeIn>
        </div>

        {/* Services Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollFadeIn key={service.id} delay={0.1 * (index % 3)}>
              <a 
                href={service.url} 
                className="group flex flex-col h-full rounded-[24px] overflow-hidden bg-white/[0.02] border border-white/[0.07] backdrop-blur-md hover:border-[#29b6d8]/40 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 flex-grow"
              >
                {/* Visual Area */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40 border-b border-white/[0.05]">
                  {/* Service Image */}
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle vignette/gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Top glass badge */}
                  <span className="absolute top-4 left-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#29b6d8]">
                    {service.badge}
                  </span>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div className="space-y-4">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#29b6d8] transition-colors duration-300">
                      {service.name}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed font-sans font-normal">
                      {service.description}
                    </p>
                    
                    {/* Key features list */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      {service.highlights.map((h, i) => (
                        <span key={i} className="text-[10px] text-white/40 border border-white/5 bg-white/[0.01] rounded-md px-2 py-0.5 font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button Link */}
                  <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white">
                    <span className="group-hover:text-[#29b6d8] transition-colors duration-300">Enter Configurator</span>
                    <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-[#29b6d8]/50 group-hover:bg-[#29b6d8]/10 flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:text-[#29b6d8] transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </a>
            </ScrollFadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
