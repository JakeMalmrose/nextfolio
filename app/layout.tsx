import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jake Malmrose | Software Engineer",
  description:
    "Jake Malmrose — full-stack engineer building backend, cloud, and AI systems. Laravel, FastAPI, .NET, React, and Azure, shipped end-to-end.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-line">
          <div className="container flex flex-wrap items-center justify-between gap-4 py-8">
            <p className="font-mono text-xs text-muted">
              © 2026 Jake Malmrose · Next.js in Docker, self-hosted on a NUC behind a Cloudflare Tunnel
            </p>
            <div className="flex items-center gap-5">
              <a
                href="https://github.com/JakeMalmrose/nextfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link font-mono text-xs"
              >
                source ↗
              </a>
              <a
                href="https://draupforge.malmrose.com"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link font-mono text-xs"
              >
                draupforge ↗
              </a>
              <span
                className="pill-disabled font-mono text-xs"
                title="OpenWebUI instance — temporarily offline, coming back soon"
              >
                ai studio · soon
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
