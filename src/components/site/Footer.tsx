import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="px-6 md:px-8 py-16 md:py-20 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5 mb-5">
            <img
              src="https://eldrex.landecs.org/logo/lanq-studio-logo.png"
              alt="LanQ Studio Logo"
              className="h-7 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
              LanQ Studio
            </span>
          </div>
          <p className="text-foreground/50 text-sm leading-relaxed mb-4">
            Designed to make sharing feel more personal, expressive, cohesive, and effortlessly yours. Compiled offline with no tracking.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-3">
            <h4 className="text-sm font-bold">Product</h4>
            <ul className="text-sm text-foreground/55 space-y-2">
              <li><Link to="/studio" className="hover:text-foreground transition-colors">Studio</Link></li>
              <li><a href="#generator" className="hover:text-foreground transition-colors">Auto-blend</a></li>
              <li><Link to="/gallery" className="hover:text-foreground transition-colors">Gallery</Link></li>
              <li><Link to="/support" className="hover:text-foreground transition-colors font-semibold text-primary">PayPal Support</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold">Company</h4>
            <ul className="text-sm text-foreground/55 space-y-2">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
