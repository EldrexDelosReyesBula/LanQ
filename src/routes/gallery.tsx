import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Gallery } from "@/components/site/Gallery";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "LanQ Templates Gallery — Visual Inspiration" },
      {
        name: "description",
        content: "Browse our curated collection of beautiful, harmonious QR codes. Tap any template to instantly remix and customize it in the Studio.",
      },
      { property: "og:title", content: "LanQ Templates Gallery" },
      { property: "og:description", content: "Browse, select, and remix beautiful QR styles instantly." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      <main className="flex-1">
        <Gallery isLanding={false} />
      </main>
      <Footer />
    </div>
  );
}
