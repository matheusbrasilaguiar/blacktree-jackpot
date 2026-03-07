"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SDK } from "@somnia-chain/reactivity";
import { createPublicClient, webSocket } from "viem";
import { somniaTestnet } from "viem/chains";

type ReactivityContextType = {
    sdk: SDK | null;
    isReady: boolean;
};

const ReactivityContext = createContext<ReactivityContextType>({ sdk: null, isReady: false });

// Using public RPC URL from docs; adjust if needed.
const RPC_WSS = "wss://dream-rpc.somnia.network/ws";

export function ReactivityProvider({ children }: { children: ReactNode }) {
    const [sdk, setSdk] = useState<SDK | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        const initSdk = async () => {
            try {
                const publicClient = createPublicClient({
                    chain: somniaTestnet,
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
