import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // icon hamburger

const items = [
  { name: "Home", href: "#hero", id: "hero" },
  { name: "About", href: "#about", id: "about" },
  { name: "Skills", href: "#skills", id: "skills" },
  { name: "Projects", href: "#projects", id: "projects" },
  { name: "Certificate", href: "#certificates", id: "certificates" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.2 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = items.map(i => document.getElementById(i.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)?.[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "bg-white/80 backdrop-blur border-b border-neutral-200" : "bg-transparent"}`}>
        
        <motion.div style={{ scaleX }} className="origin-left h-0.5 bg-neutral-900/80" />

        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#hero" onClick={(e)=>handleNavClick(e,"hero")} className="font-semibold tracking-tight">
            Teddy Agustinus
          </a>

          <div className="hidden md:flex items-center gap-6">
            {items.map(link => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e)=>handleNavClick(e, link.id)}
                className={`text-sm transition ${
                  active === link.id ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={24}/> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[72px] left-0 right-0 bg-white border-b border-neutral-200 shadow-md z-40 md:hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {items.map(link => (
                <button
                  key={link.id}
                  onClick={(e)=>handleNavClick(e, link.id)}
                  className={`text-left text-base ${
                    active === link.id ? "text-neutral-900 font-semibold" : "text-neutral-600"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
