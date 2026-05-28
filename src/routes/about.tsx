import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, Rocket, Eye, ShieldCheck, Cpu } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LanQ — Visual QR Engineering & Philosophy" },
      {
        name: "description",
        content: "Discover how LanQ reframes functional QR utilities into aesthetic digital brand icons. Local-first, private, and beautifully balanced.",
      },
      { property: "og:title", content: "About LanQ — Reframing QR Art" },
      { property: "og:description", content: "Discover Visual QR design engineered for modern individuals." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      
      <main className="flex-1 py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb / Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground/45 hover:text-foreground text-sm font-semibold mb-12 group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Heading */}
          <div className="space-y-4 mb-16">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">THE MANIFESTO</span>
            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
              A better way to be seen.
            </h1>
            <p className="text-xl text-foreground/50 leading-relaxed font-semibold font-sans">
              LanQ transforms standard machine-readable matrices into high-fidelity brand indicators. By integrating modern design layouts with mathematical contrast theory, we change how links are shared physically and digitally.
            </p>
          </div>

          {/* Grid of Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 bg-surface border border-border rounded-[2rem] space-y-4 shadow-soft">
              <div className="p-3 bg-rose-500/10 text-rose-600 rounded-2xl w-fit">
                <Rocket className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">The Mission</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Traditional code systems are cold, mechanical blocks. LanQ reframes them as canvas extension points for visual expression, brand cohesion, and physical presence.
              </p>
            </div>

            <div className="p-6 bg-surface border border-border rounded-[2rem] space-y-4 shadow-soft">
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl w-fit">
                <Eye className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Auto-Blend Calibration</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Our bespoke color math engine calculates relative canvas-luminance offsets dynamically, ensuring all designs sustain a strict contrast ratio threshold for absolute scan accuracy.
              </p>
            </div>

            <div className="p-6 bg-surface border border-border rounded-[2rem] space-y-4 shadow-soft">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl w-fit">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Local Isolation</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Your data never flows into remote tracking databases. Configurations and customized template parameters compile strictly inside client-side isolated memory models.
              </p>
            </div>

            <div className="p-6 bg-surface border border-border rounded-[2rem] space-y-4 shadow-soft">
              <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl w-fit">
                <Cpu className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Ultra-Sharp Exports</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Outputs utilize mathematical SVG paths and lossless high-density raster canvases, scaling cleanly from web screens to outdoor billboards.
              </p>
            </div>
          </div>

          {/* Deep Narrative Content */}
          <article className="prose prose-neutral max-w-none text-foreground/80 space-y-8 text-sm sm:text-base leading-relaxed">
            <div>
              <h2 className="text-2xl font-black font-display text-foreground mt-8 mb-4">The Auto-Blend Algorithm</h2>
              <p>
                In aesthetic QR design, the primary challenge is Balancing beauty and scannability. Traditional systems compile flat dark pixels on light surfaces. When custom colors are introduced, readers fail due to lack of contrast.
              </p>
              <p>
                LanQ addresses this challenge with the <strong>Auto-Blend Contrast Engine</strong>. When a color combination is initialized:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-foreground/75 text-sm font-medium">
                <li><strong>Luminance Auditing:</strong> The engine translates the Hex color values of your chosen theme into the relative WCAG luminance spectrum.</li>
                <li><strong>Lightness Contrast Adjustments:</strong> The background's luminance is checked. If the contrast factor drops below the critical 4.5:1 threshold, the algorithm runs a correction loop: for dark backgrounds, it lightens the foreground; for light backgrounds, it darkens the foreground color stops.</li>
                <li><strong>Uniform Scale Factor:</strong> In gradients (Linear or Radial) and solid palettes, all primary colors are scaled proportionally to retain their aesthetic tone while satisfying hardware scanner optics.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-black font-display text-foreground mt-10 mb-4">Core Customization Suite</h2>
              <p>
                Studio configurations grant full authority over vector coordinates, turning standard structures into bespoke symbols using three visual pillars:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div className="p-5 bg-background border border-border rounded-2xl">
                  <h4 className="font-bold text-foreground mb-2 text-sm text-[12px] font-mono tracking-wider uppercase">1. Palette Styles</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Select from <strong>curated solid backgrounds</strong> for a minimalist aesthetic, <strong>curated linear gradients</strong> for a sleek flow, or <strong>curated radial gradients</strong> for a dynamic glow.
                  </p>
                </div>
                <div className="p-5 bg-background border border-border rounded-2xl">
                  <h4 className="font-bold text-foreground mb-2 text-sm text-[12px] font-mono tracking-wider uppercase">2. Marker Shapes</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Style corner frames using <strong>classic square edges</strong>, <strong>extra-rounded circles</strong>, or <strong>modern gapped panels</strong>, paired with custom-aligned inner dots.
                  </p>
                </div>
                <div className="p-5 bg-background border border-border rounded-2xl">
                  <h4 className="font-bold text-foreground mb-2 text-sm text-[12px] font-mono tracking-wider uppercase">3. Dot Patterns</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Transform data grids into beautiful matrices using <strong>organic fluid strokes</strong>, <strong>precise modern circles</strong>, <strong>classic squares</strong>, or <strong>minimal disconnected structures</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black font-display text-foreground mt-10 mb-4">Zero-Telemetry Privacy Guarantee</h2>
              <p>
                Standard online QR creators serve as data funnels—requiring user registration, intercepting your visits, compiling profiles, and tracking individual devices.
              </p>
              <p>
                LanQ operates differently. Our software runs entirely local-first. Destinations enter your local IndexedDB database and are written into vector shapes in your browser memory. We have no remote databases to collect logs, no third-party scripts to record physical clicks, and no active tracking cookies. Your codes remain valid permanently, with zero telemetry.
              </p>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/studio"
                className="w-full sm:w-auto text-center py-3.5 px-8 rounded-2xl bg-prism text-white font-bold shadow-prism hover:opacity-95 active:scale-95 transition-all outline-none"
              >
                Launch Custom Studio
              </Link>
              <Link
                to="/gallery"
                className="w-full sm:w-auto text-center py-3.5 px-8 rounded-2xl border border-border hover:bg-surface font-semibold transition-all text-sm text-foreground/75"
              >
                Explore Gallery Presets
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
