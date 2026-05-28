import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 backdrop-blur-md bg-background/70 border-b border-border">
        {/* Left: Logo + LanQ */}
        <Link to="/" className="flex items-center gap-2 transition-transform duration-300 active:scale-95">
          <img
            src="https://eldrex.landecs.org/logo/lanq-studio-logo.png"
            alt="LanQ Studio"
            className="h-8 md:h-9 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="font-display font-black text-xl md:text-2xl tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
            LanQ
          </span>
        </Link>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            className="text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="/gallery"
            className="text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
          >
            Gallery
          </Link>
          <Link
            to="/about"
            className="text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
          >
            About
          </Link>
          <Link
            to="/studio"
            className="px-5 py-2.5 rounded-full bg-foreground text-background font-semibold hover:bg-primary sm:hover:text-white transition-all duration-200 shadow-soft active:scale-95"
          >
            Open Studio
          </Link>
        </div>

        {/* Mobile Menu Toggle (Hidden on Desktop) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="md:hidden p-2 text-foreground/85 hover:text-foreground active:scale-95 transition-all cursor-pointer"
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black backdrop-blur-sm md:hidden"
            />

            {/* Content list */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed inset-x-0 top-[65px] z-40 p-6 bg-surface border-b border-border shadow-soft flex flex-col gap-4 md:hidden"
            >
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-base font-semibold text-foreground/75 hover:text-foreground py-2 border-b border-border/40"
              >
                Home
              </Link>
              <Link
                to="/gallery"
                onClick={() => setMenuOpen(false)}
                className="text-base font-semibold text-foreground/75 hover:text-foreground py-2 border-b border-border/40"
              >
                Gallery
              </Link>
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="text-base font-semibold text-foreground/75 hover:text-foreground py-2 border-b border-border/40"
              >
                About
              </Link>
              <Link
                to="/studio"
                onClick={() => setMenuOpen(false)}
                className="w-full mt-2 py-3 px-6 rounded-2xl bg-prism text-white font-bold text-center shadow-prism hover:opacity-95 active:scale-95 transition-all"
              >
                Open Studio
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
