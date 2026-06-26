import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, User, ChevronDown, ShoppingBag, Briefcase, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const lastScrollY = useRef(0);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down, show only when scrolled back to the top (like Apple website)
      if (currentScrollY < 50) {
        setVisible(true);
      } else {
        setVisible(false);
        setAccountOpen(false);
      }

      setScrolled(currentScrollY > 20);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    const onClick = (e: globalThis.MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const navItems = [
    { name: "Services", href: "services-photostat.html" },
    { name: "Gallery", href: "#gallery" },
    { name: "About Us", href: "about.html" },
  ];

  const accounts = [
    { label: "Customer Portal", desc: "Sign up · track & manage orders", href: "customer.html", Icon: ShoppingBag },
    { label: "Staff Login", desc: "Process incoming orders", href: "staff.html", Icon: Briefcase },
    { label: "Admin / Owner", desc: "Full dashboard & reports", href: "staff.html", Icon: ShieldCheck },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 will-change-transform ${
        scrolled
          ? "py-4 liquid-glass border-b border-white/5"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/30 transition-all duration-300">
            <img
              src="logo-arrow.png"
              alt="Ambangan Fast Print"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <span className="font-sans text-sm tracking-wider font-bold block text-white uppercase">Ambangan</span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#29b6d8] -mt-0.5 block font-semibold">Fast Print</span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 relative group py-2"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#29b6d8] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Account / Sign In dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className="liquid-glass hover:bg-white/5 text-white px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 border border-white/10 hover:border-[#29b6d8]/50"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${accountOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{
                    background: "rgba(10, 14, 22, 0.96)",
                    backdropFilter: "blur(28px) saturate(180%)",
                    WebkitBackdropFilter: "blur(28px) saturate(180%)",
                  }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/15 overflow-hidden shadow-2xl shadow-black/60"
                >
                  <div className="px-4 pt-3 pb-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Login / Sign Up</p>
                  </div>
                  {accounts.map(({ label, desc, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-200 border-t border-white/5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#29b6d8]/10 border border-[#29b6d8]/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#29b6d8]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-tight">{label}</p>
                        <p className="text-[11px] text-white/40 mt-0.5">{desc}</p>
                      </div>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Get a Quote */}
          <a
            href="#estimate"
            className="bg-[#29b6d8] hover:bg-[#4ec8e4] text-black px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#29b6d8]/20"
          >
            Get a Quote
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 liquid-glass-strong border-b border-white/10 overflow-hidden md:hidden"
          >
            <div className="flex flex-col p-6 gap-5">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-white/70 hover:text-white py-2 border-b border-white/5"
                >
                  {item.name}
                </a>
              ))}

              {/* Account links */}
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold pt-1">Login / Sign Up</p>
              {accounts.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-white/70 hover:text-white"
                >
                  <Icon className="w-4 h-4 text-[#29b6d8]" />
                  {label}
                </a>
              ))}

              <a
                href="#estimate"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 bg-[#29b6d8] text-black font-semibold rounded-full text-sm mt-2 hover:bg-[#29b6d8]/90 transition-colors"
              >
                Get a Quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
