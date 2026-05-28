import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Generator } from "@/components/site/Generator";
import { Gallery } from "@/components/site/Gallery";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LanQ — A better way to be seen" },
      {
        name: "description",
        content:
          "LanQ is a visual QR design platform. Auto-blend turns any link into a brand-perfect, gradient QR you actually want to share.",
      },
      { property: "og:title", content: "LanQ — A better way to be seen" },
      {
        property: "og:description",
        content: "Beautiful, scannable, local-first QR design.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Generator />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
