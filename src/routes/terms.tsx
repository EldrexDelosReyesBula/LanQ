import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, Scale, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — LanQ Studio" },
      {
        name: "description",
        content: "Review the full professional Terms of Use parameters governing the usage of LanQ Studio and visual generator services.",
      },
      { property: "og:title", content: "Terms of Use — LanQ Studio" },
      { property: "og:description", content: "General rules, conditions, and permissions parameters for local QR asset exports." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />

      <main className="flex-1 py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back click */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground/45 hover:text-foreground text-sm font-semibold mb-12 group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Page header */}
          <div className="space-y-4 mb-16">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">LEGAL FRAMEWORK</span>
            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
              Terms of Use
            </h1>
            <p className="text-sm font-mono text-foreground/50">
              Last Updated: May 2026 • Effective Immediately
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-stretch">
            {/* Outline list */}
            <div className="w-full md:w-64 space-y-3 shrink-0">
              <div className="sticky top-28 p-5 bg-surface border border-border rounded-2xl space-y-4 shadow-soft">
                <div className="flex items-center gap-2.5 text-foreground font-bold text-sm">
                  <Scale className="size-4 text-primary" />
                  <span>Document Outline</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-foreground/60">
                  <p className="hover:text-foreground transition-colors cursor-pointer">• 1. Acceptance of Terms</p>
                  <p className="hover:text-foreground transition-colors cursor-pointer">• 2. Intellectual Property</p>
                  <p className="hover:text-foreground transition-colors cursor-pointer">• 3. Fair Usage & Generation</p>
                  <p className="hover:text-foreground transition-colors cursor-pointer">• 4. No Warranties (As-Is)</p>
                  <p className="hover:text-foreground transition-colors cursor-pointer">• 5. Force Majeure & Policy</p>
                </div>
              </div>
            </div>

            {/* Content paragraph stream */}
            <div className="flex-1 prose prose-neutral max-w-none text-foreground/80 space-y-8 text-sm sm:text-base leading-relaxed">
              <section id="acceptance" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                  <FileText className="size-5 text-primary shrink-0" />
                  1. Acceptance of General Terms
                </h2>
                <p>
                  By accessing, generating, downloading, or engaging with any aspect of the <strong>LanQ Studio</strong> platform ("the Service"), you confirm your complete and binding acceptance of these Terms. If you do not accept these parameters, you are prohibited from utilizing the generators, exports, or galleries.
                </p>
              </section>

              <section id="intellectual" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  2. Intellectual Property Rights & Commercial Exports
                </h2>
                <p>
                  All software engines, proprietary layout matrices, Auto-Blend algorithms, styling schemes, and source codes remain the exclusive intellectual property of LanQ Studio. 
                </p>
                <p>
                  <strong className="text-foreground">Your Exports:</strong> Any QR assets, imagery formats (SVG, PNG, JPG), or configuration streams generated and exported by you using the Service belong to you. We grant you an unlimited, royalty-free, perpetual, and global license to distribute, sell, publish, or print your generated QR assets for commercial, educational, promotional, or personal projects.
                </p>
              </section>

              <section id="testing" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  3. Scannability Testing & User Responsibility
                </h2>
                <p>
                  While our **Auto-Blend Contrast Engine** is designed to automatically correct low-contrast color choices of linear/radial gradients and solid backgrounds, scanner hardware capabilities vary immensely depending on physical lens glass, screen glare, ambient shadows, and dirty apertures.
                </p>
                <p className="font-semibold text-foreground bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
                  CRITICAL TEST MANDATE: You are strictly required to perform physical test scans of your configured visual outputs under normal and low-light environments BEFORE finalizing any commercial printing runs, billboard distributions, product packaging campaigns, or paper distributions. LanQ Studio is not responsible for any wasted print capital, lost branding, or distribution costs caused by unscannable colors.
                </p>
              </section>

              <section id="usage" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  4. Content & Destination Restrictions
                </h2>
                <p>
                  Since coordinates are generated entirely browser-side, you remain solely responsible for the validity, contents, and security guidelines of the URLs and text strings configured in exported items.
                </p>
                <p>
                  You agree to not build, share, or publish codes pointing to material containing toxic downloads, financial fraud, phishing parameters, illegal materials, or deceptive destination triggers.
                </p>
              </section>

              <section id="warranties" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  5. Limitation of Liability & No Warranties
                </h2>
                <p>
                  THE SERVICES ARE PROVIDED COMPLETELY "AS-IS" AND "AS-AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, TO THE HIGHEST EXTENT PERMITTED BY LAW. LANQ STUDIO DOES NOT WARRANT THAT CODE DESIGNS WILL RENDER SUCCESSFULLY ON EVERY PHYSICAL CAMERA HARDWARE IN EXISTENCE. 
                </p>
              </section>

              <section id="disclaimers" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  6. Modifications to Terms
                </h2>
                <p>
                  We reserve the right to revise or append these Terms periodically. Continued usage of the site post-amendment constitutes acceptance. If any clause is found invalid by a court, other clauses continue in complete effect.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
