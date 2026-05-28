import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, Heart, Shield, Sparkles, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support Development & Donation — LanQ Studio" },
      {
        name: "description",
        content: "Donate to help sustain LanQ Studio's independent developer operations. 100% offline-first, tracker-free visual tools.",
      },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const donateUrl = "https://www.paypal.com/ncp/payment/QS9JUM6FN8SCL";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />

      <main className="flex-1 py-16 md:py-24 px-6 md:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto">
          {/* Back Action */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground/45 hover:text-foreground text-sm font-semibold mb-10 group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Card Layout */}
          <div className="relative overflow-hidden bg-surface border border-border rounded-[2.5rem] p-8 md:p-12 shadow-prism">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative space-y-6">
              {/* Header Badge */}
              <div className="flex items-center gap-2.5">
                <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl w-fit">
                  <Heart className="size-6 fill-rose-500/20" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">COMMUNITY SUPPORT</span>
                  <h1 className="font-display text-3xl font-black tracking-tight text-foreground mt-0.5">
                    Sustain LanQ Studio
                  </h1>
                </div>
              </div>

              {/* Pitch */}
              <div className="space-y-4 text-foreground/70 text-sm md:text-base leading-relaxed">
                <p>
                  LanQ is an independent open-source venture designed entirely around developer craft, absolute personal privacy, and aesthetic integrity. We choose to stay completely self-funded:
                </p>
                
                {/* Core Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="flex items-start gap-3 p-4 bg-background/50 border border-border/60 rounded-2xl">
                    <Shield className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-foreground block">Zero Advertisements</span>
                      <p className="text-[11px] text-foreground/50 mt-0.5 leading-normal">
                        No payload cookies, diagnostic tags, or popups cluttering your view.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-background/50 border border-border/60 rounded-2xl">
                    <Sparkles className="size-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-foreground block">Bespoke Precision</span>
                      <p className="text-[11px] text-foreground/50 mt-0.5 leading-normal">
                        Empowering users with fully customizable gradient designs and high-fidelity vectors.
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  Your donations help us offset offline package dependencies, compute builds, hosting deployment layers (Cloud Run containers), and continued feature expansion. 
                </p>
              </div>

              {/* Secure Prompt Disclaimer */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-foreground/60 leading-normal">
                <AlertCircle className="size-4.5 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  You will be safely forwarded to the secure PayPal processing gateway to complete your transaction under a verified payment token.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch gap-3">
                <a
                  href={donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-4 px-8 rounded-2xl bg-prism text-white font-bold shadow-prism hover:opacity-95 active:scale-95 transition-all outline-none text-sm cursor-pointer select-none"
                >
                  Confirm PayPal Donation
                </a>
                <Link
                  to="/studio"
                  className="px-6 py-4 rounded-2xl border border-border hover:bg-neutral-50/50 text-center font-semibold transition-all text-sm text-foreground/70"
                >
                  Continue to Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
