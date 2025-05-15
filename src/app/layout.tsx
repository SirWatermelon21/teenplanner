'use client';

import "./globals.css";
import { Inter } from "next/font/google";
import { Caveat } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
});

export const metadata = {
  title: "Trip Planner",
  description: "A collaborative trip planning application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
