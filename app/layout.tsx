import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fan Travel Tracker | How far did you travel this season?",
  description: "Calculate how many miles you travelled following your football club across all competitions this season.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
