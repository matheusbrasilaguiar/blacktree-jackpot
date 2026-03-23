"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SDK } from "@somnia-chain/reactivity";
import { createPublicClient, webSocket, defineChain } from "viem";

type ReactivityContextType = {
    sdk: SDK | null;
    isReady: boolean;
};

const ReactivityContext = createContext<ReactivityContextType>({ sdk: null, isReady: false });

const RPC_WSS = "wss://dream-rpc.somnia.network/ws";

// The Somnia Reactivity SDK internally calls webSocket() with NO args and resolves
// the URL from chain.rpcUrls.default.webSocket — so we must define it explicitly.
const somniaTestnetWithWss = defineChain({
    id: 50312,
    name: "Somnia Testnet",
    nativeCurrency: { name: "Somnia Testnet Token", symbol: "STT", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://dream-rpc.somnia.network"],
            webSocket: [RPC_WSS],
        },
    },
});

export function ReactivityProvider({ children }: { children: ReactNode }) {
    const [sdk, setSdk] = useState<SDK | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        const initSdk = async () => {
            try {
                const publicClient = createPublicClient({
                    chain: somniaTestnetWithWss,
                    transport: webSocket(RPC_WSS),
                });

                const reactivitySdk = new SDK({ public: publicClient });

                if (mounted) {
                    setSdk(reactivitySdk);
                    setIsReady(true);
                    console.log("[Reactivity] SDK Initialized via WebSocket");
                }
            } catch (err) {
                console.error("[Reactivity] Error initializing SDK:", err);
            }
        };

        initSdk();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <ReactivityContext.Provider value={{ sdk, isReady }}>
            {children}
        </ReactivityContext.Provider>
    );
}

export function useReactivity() {
    return useContext(ReactivityContext);
}
