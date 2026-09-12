import type { Metadata } from "next";
import "./globals.css";
import { AudioController } from "@/components/audio-controller";
import { Shield, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Aetheria: Life RPG — The Hunter's Protocol",
  description: "Gamified full-stack Life RPG translating real-world habits into interactive progression.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#070a12] text-slate-100 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md px-4 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black tracking-wider text-base text-white">AETHERIA</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    LIFE RPG
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">The Hunter's Productivity Protocol</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AudioController />
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500 font-mono">
          <span>Aetheria Life RPG &bull; Web Hackathon 2026 &bull; Fully Persisted via Cloud PostgreSQL</span>
        </footer>
      </body>
    </html>
  );
}
