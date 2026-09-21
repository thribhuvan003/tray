import { LandingPage } from "@/components/landing/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Tray — Your stall. Your own ordering system." },
  description:
    "A QR menu, orders, and a daily overview for your food stall. Customers pay your UPI; you check the payment and serve the order. Try Tray with sample data.",
  openGraph: {
    title: "Tray — Your stall. Your own ordering system.",
    description: "Menu, orders, and daily totals. Built for the people behind the counter.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tray — Your stall. Your own ordering system.",
    description: "Menu, orders, and daily totals. Built for the people behind the counter.",
  },
};

export default function Page() {
  // The marketing page is tenant-neutral and can be statically served from the
  // edge. Tenant-specific discovery and ordering live under /c/[slug].
  return <LandingPage tenant={null} />;
}
