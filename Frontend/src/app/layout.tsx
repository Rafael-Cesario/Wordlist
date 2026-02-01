import "./globals.css";
import type { Metadata } from "next";
import { Funnel_Sans } from "next/font/google";

const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wordlist",
  description: "Um site para estudar um idioma.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br">
      <body className={`${funnelSans.variable} antialiased`}>{children}</body>
    </html>
  );
}

