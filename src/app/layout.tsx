import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruthie Bank — Your Money. Your World. Your Future.",
  description: "A secure, multi-currency financial platform built for a connected world.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
