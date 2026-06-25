import { Mail, MapPin, Globe, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#05070a] pt-20 pb-12 border-t border-white/5 overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-0 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden bg-white/5 border border-white/10">
                <img src="logo-arrow.png" alt="Ambangan Fast Print" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <span className="font-sans text-sm tracking-wider font-bold block text-white uppercase">Ambangan</span>
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#29b6d8] -mt-0.5 block font-semibold">Fast Print</span>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed font-sans max-w-sm">
              FA Sinar Fajar Enterprise (AS0395296-D) — delivering high-speed precision printing and creative design solutions for businesses of all sizes across Malaysia.
            </p>
          </div>

          {/* Studio Locations */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-[#29b6d8] font-semibold">
              Our Location
            </h4>
            <div className="space-y-3 text-xs text-white/50 font-sans">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white/30 mt-0.5" />
                <div>
                  <p className="font-medium text-white/70">Ambangan Fast Print</p>
                  <p className="text-white/40">Kedah, Malaysia</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-white/30 mt-0.5" />
                <div>
                  <p className="font-medium text-white/70">FA Sinar Fajar Enterprise</p>
                  <p className="text-white/40">Registration No. AS0395296-D</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-[#29b6d8] font-semibold">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-white/50 font-sans">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white/30" />
                <a href="mailto:info@ambanganfastprint.com" className="hover:text-white transition-colors">
                  info@ambanganfastprint.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white/30" />
                <a href="tel:+60" className="hover:text-white transition-colors">
                  +60 12-694 9147
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-white/30 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  @ambanganfastprint
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/30 tracking-wider uppercase font-mono">
          <p>© {currentYear} Ambangan Fast Print · FA Sinar Fajar Enterprise (AS0395296-D). All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="track.html" className="hover:text-[#29b6d8] transition-colors">Track Order</a>
            <a href="staff.html" className="hover:text-[#29b6d8] transition-colors">Staff Portal</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
