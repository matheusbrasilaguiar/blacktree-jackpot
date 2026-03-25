import type { Metadata } from "next";
import { Bebas_Neue, Anton, Space_Mono, Syne } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ReactivityProvider } from "@/components/ReactivityProvider";

const brigadierSans = localFont({
  src: "./fonts/BrigadierSansRegular.otf",
  variable: "--font-brigadier",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
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
  title: "BlackTree | Your onchain iGaming Platform",
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
        className={`${bebasNeue.variable} ${syne.variable} ${anton.variable} ${spaceMono.variable} ${brigadierSans.variable} antialiased text-white bg-black min-h-screen flex flex-col`}
      >
        <Providers>
          <ReactivityProvider>{children}</ReactivityProvider>
        </Providers>
      </body>
    </html>
  );
}
