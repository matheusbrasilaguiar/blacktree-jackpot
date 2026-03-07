import type { Metadata } from "next";
import { Bebas_Neue, Anton, Space_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ReactivityProvider } from "@/components/ReactivityProvider";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlackTree | Your onchain jackpot",
  description: "The first onchain jackpot that feels like watching a live event.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${anton.variable} ${spaceMono.variable} antialiased text-white bg-black min-h-screen flex flex-col`}
      >
        <Providers>
          <ReactivityProvider>{children}</ReactivityProvider>
        </Providers>
      </body>
    </html>
  );
}
