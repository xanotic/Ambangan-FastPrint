import { motion } from "framer-motion";
import ScrollFadeIn from "./ScrollFadeIn";

interface ProjectItem {
  title: string;
  category: string;
  image: string;
  stock: string;
  finish: string;
  colSpan: string;
}

export default function ShowcaseGrid() {
  const projects: ProjectItem[] = [
    {
      title: "Event & Promo Banners",
      category: "Large Format Printing",
      image: "banner_portfolioshowcase.jpg",
      stock: "Outdoor Vinyl Tarpaulin",
      finish: "Brass Eyelets + Hemmed Edges",
      colSpan: "md:col-span-8",
    },
    {
      title: "Custom Label Stickers",
      category: "Die-Cut Stickers",
      image: "sticker_portfolioshowcase.jpg",
      stock: "Waterproof PP Vinyl",
      finish: "Kiss-Cut Sticker Sheets",
      colSpan: "md:col-span-4",
    },
    {
      title: "Company Rubber Stamps",
      category: "Rubber Stamp (Chop)",
      image: "chop_portfolioshowcase.jpg",
      stock: "Self-Inking Mount",
      finish: "Black / Blue / Red Ink",
      colSpan: "md:col-span-4",
    },
    {
      title: "Certificates & Sijil",
      category: "Event & School Printing",
      image: "sijil_portfolioshowcase.jpg",
      stock: "260gsm Art Card",
      finish: "Full-Colour Gloss",
      colSpan: "md:col-span-4",
    },
    {
      title: "Receipt & Invoice Books",
      category: "Business Stationery",
      image: "receipt_portfolioshowcase.jpg",
      stock: "NCR Carbonless Paper",
      finish: "Numbered + Perforated",
      colSpan: "md:col-span-4",
    },
    {
      title: "Wedding Invitations",
      category: "Kad Kahwin",
      image: "kad_kahwinportfolioshowcase.jpg",
      stock: "Pearl Shimmer Card",
      finish: "Hot Foil + Envelope Set",
      colSpan: "md:col-span-6",
    },
    {
      title: "Custom Calendars",
      category: "Yearly Calendar Printing",
      image: "calender_portfolioshowcase.jpg",
      stock: "Art Card + Wire-O Bind",
      finish: "Desk & Wall Formats",
      colSpan: "md:col-span-6",
    },
  ];

  return (
    <section id="gallery" className="relative py-28 bg-[#07090e] border-t border-white/5">
      {/* Dynamic background glow */}
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-[#b0c4de]/5 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <ScrollFadeIn delay={0} className="space-y-4">
            <span className="text-[10px] tracking-[0.3em] font-semibold text-white/50 uppercase block">Portfolio Showcase</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Selected Studio Works
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.15}>
            <p className="text-sm text-white/50 font-sans max-w-sm md:text-right">
            </p>
          </ScrollFadeIn>
        </div>

        {/* Masonry-like Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className={`group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0e1424]/20 ${project.colSpan}`}
            >
              {/* Image Container with Hover zoom */}
              <div className="relative aspect-[16/10] md:aspect-auto md:h-[480px] w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/30 to-transparent opacity-80" />
              </div>

              {/* Text specifications and info */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#b0c4de] font-semibold">
                    {project.category}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-white leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 pt-2 border-t border-white/10 text-[10px] text-white/40 font-mono">
                    <span>Stock: {project.stock}</span>
                    <span>Finish: {project.finish}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
