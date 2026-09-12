import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { GameProvider } from "@/lib/game-context";

export const metadata: Metadata = {
  title: "Aetheria – The Hunter's Protocol",
  description:
    "A gamified Life RPG that transforms real-world goals into quests, progression, rewards, and mastery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-[#f7f9fa] text-slate-800 antialiased font-sans selection:bg-emerald-200 selection:text-emerald-900">
        <GameProvider>
          <AppShell>{children}</AppShell>
        </GameProvider>
      </body>
    </html>
  );
}