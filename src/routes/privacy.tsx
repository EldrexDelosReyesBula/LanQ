import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, Shield, EyeOff, Lock, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — LanQ Studio" },
      {
        name: "description",
        content: "Discover how LanQ prioritizes complete user isolation and client-side encryption. Zero logs, zero cookie trackers, zero third-party databases.",
      },
      { property: "og:title", content: "Privacy Policy — LanQ Studio" },
      { property: "og:description", content: "Learn about our strict privacy standard. Total client side ownership, zero database tracking." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />

      <main className="flex-1 py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground/45 hover:text-foreground text-sm font-semibold mb-12 group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Heading */}
          <div className="space-y-4 mb-16">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">ZERO COLLECTION STANDARDS</span>
            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-sm font-mono text-foreground/50">
              Last Updated: May 2026 • Absolute Privacy Promise
            </p>
          </div>

          {/* Highlights of privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-3 shadow-soft">
              <EyeOff className="size-5 text-rose-500" />
              <h4 className="text-sm font-bold text-foreground">No tracking</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                We never store physical destination links, click histories, or query coordinates on our systems.
              </p>
            </div>
            <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-3 shadow-soft">
              <Lock className="size-5 text-blue-500" />
              <h4 className="text-sm font-bold text-foreground">Browser-Only State</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                App configurations, custom presets, and remix actions reside completely inside your local IndexedDB storage.
              </p>
            </div>
            <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-3 shadow-soft">
              <HeartHandshake className="size-5 text-emerald-500" />
              <h4 className="text-sm font-bold text-foreground">Open Transparency</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                No tracking cookies, no advertising metrics scripts, and zero telemetry payloads run on our codebase.
              </p>
            </div>
          </div>

          {/* Full Policy Stream */}
          <article className="prose prose-neutral max-w-none text-foreground/80 space-y-8 text-sm sm:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                <Shield className="size-5 text-primary shrink-0" />
                1. Localized Context Processing (No Vector Interceptions)
              </h2>
              <p>
                Unlike standard dynamic QR platforms which operate as remote redirect centers, <strong>LanQ Studio</strong> acts entirely locally on your processor. Whenever you type or paste a web address destination, or configure text payload vectors, the browser loads standard geometry schemas without triggering external APIs.
              </p>
              <p>
                Because visual designs require high-precision luminance calculations to assure WCAG-compliant readability, these mathematics take place strictly in the active sandbox context of your device. <strong>We do not capture, proxy, review, or store your links.</strong>
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                <Shield className="size-5 text-primary shrink-0" />
                2. Sandboxed Browser Storage & Cache Persistence
              </h2>
              <p>
                Our studio includes dynamic editing features allowing you to save draft creations or remix custom presets. These configurations are persisted locally utilizing the Web Storage API and IndexedDB layers.
              </p>
              <p>
                Since we maintain no network databases to back up client documents, this data lives exclusively on your hard drive. If you clear temporary browser cookies, wipe application caches, or perform a system reset, your local projects dashboard will be permanently cleared. LanQ staff have zero capacity to reconstruct or salvage your local data libraries.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                <Shield className="size-5 text-primary shrink-0" />
                3. Analytical Trackers & Cookie Isolation
              </h2>
              <p>
                LanQ carries a strict anti-surveillance infrastructure standard. Our systems do not load:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-foreground/75 text-sm">
                <li>Marketing cookies, tracking pixels, or cross-site fingerprinting vectors.</li>
                <li>Commercial telemetry suites such as Google Analytics, Hotjar, or Meta Ads beacons.</li>
                <li>Log management streams that record your device IP address, geographic position, or agent headers.</li>
              </ul>
              <p>
                Your physical location and digital behaviors remain entirely private.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                <Shield className="size-5 text-primary shrink-0" />
                4. QR Scanner Mechanics & Device Operations
              </h2>
              <p>
                When you download and print an image or visual vector, physical scans of that output are subject purely to the camera lens app used by the scanner. LanQ is in no way involved in physical scan operations, does not generate redirect wrapper URLs, and collects no telemetry when someone scans your visual codes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
                <Shield className="size-5 text-primary shrink-0" />
                5. Compliance Audits & Contact Framework
              </h2>
              <p>
                Because our codebase is built to be open, auditable, and light, you are welcome to inspect active network streams using standard browser Developer Tools. You will find that zero remote calls are generated during any creation, editing, or export processes. If you have questions regarding our local engineering architecture, feel free to contact us.
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
