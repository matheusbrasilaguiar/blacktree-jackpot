"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

const somniaTestnet = defineChain({
    id: 50312,
    name: "Somnia Testnet",
    nativeCurrency: { name: "Somnia Testnet Token", symbol: "STT", decimals: 18 },
    rpcUrls: {
        default: { http: ["https://dream-rpc.somnia.network"] },
        public: { http: ["https://dream-rpc.somnia.network"] },
    },
    blockExplorers: {
        default: { name: "Somnia Explorer", url: "https://somnia-network-testnet.explorer.caldera.xyz" },
    },
});

export const wagmiConfig = getDefaultConfig({
    appName: 'BlackTree Jackpot',
    projectId: 'c05dc342b781da670c2f829ca1a13bde', // WalletConnect dummy project ID or your own
    chains: [somniaTestnet],
    ssr: true, // required for Next.js App Router
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme({
                    accentColor: '#ffffff',
                    accentColorForeground: '#000000',
                    borderRadius: 'medium',
                    fontStack: 'system'
                })}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
