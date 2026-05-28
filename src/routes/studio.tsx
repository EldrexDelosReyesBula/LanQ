import { createFileRoute } from "@tanstack/react-router";
import { Studio } from "@/features/generator/Studio";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "LanQ Studio — Design your QR" },
      {
        name: "description",
        content:
          "Full control: dot styles, linear and radial gradients, logo upload, contrast guard, and PNG/SVG/JPEG export. Local-first.",
      },
      { property: "og:title", content: "LanQ Studio" },
      { property: "og:description", content: "Design your QR with full creative control." },
    ],
  }),
  component: () => <Studio />,
});
