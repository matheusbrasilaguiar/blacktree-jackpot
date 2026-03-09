import { useEffect, useRef } from "react";
import { createPublicClient, webSocket } from "viem";
import { somniaTestnet } from "viem/chains";

// We read the deployed contract address from the environment variables.
export const JACKPOT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_JACKPOT_CONTRACT_ADDRESS as `0x${string}`;
const RPC_WSS = "wss://dream-rpc.somnia.network/ws";

// Standard Public Client for WebSocket subscriptions with reconnection logic
const wssClient = createPublicClient({
    chain: somniaTestnet,
    transport: webSocket(RPC_WSS, {
        keepAlive: true,
        reconnect: true,
    }),
});

const BLACKTREE_ABI = [
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "participant", type: "address" },
            { indexed: false, internalType: "uint256", name: "newJackpot", type: "uint256" },
            { indexed: false, internalType: "uint256", name: "roundId", type: "uint256" },
        ],
        name: "TicketPurchased",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "roundId", type: "uint256" },
            { indexed: false, internalType: "address", name: "first", type: "address" },
            { indexed: false, internalType: "address", name: "second", type: "address" },
            { indexed: false, internalType: "address", name: "third", type: "address" },
            { indexed: false, internalType: "uint256", name: "totalPrize", type: "uint256" },
        ],
        name: "JackpotWon",
        type: "event",
    },
] as const;

type UseJackpotReactivityParams = {
    onTicketPurchased: (participant: string, newJackpot: bigint, roundId: bigint) => void;
    onJackpotWon: (roundId: bigint, first: string, second: string, third: string, totalPrize: bigint) => void;
};

export function useJackpotReactivity({ onTicketPurchased, onJackpotWon }: UseJackpotReactivityParams) {
    const onTicketRef = useRef(onTicketPurchased);
    const onWinRef = useRef(onJackpotWon);

    useEffect(() => {
        onTicketRef.current = onTicketPurchased;
        onWinRef.current = onJackpotWon;
    }, [onTicketPurchased, onJackpotWon]);

    useEffect(() => {
        console.log("[Reactivity] Starting WebSocket observers...");

        const safeStringifyError = (err: unknown) => {
            try {
                if (err instanceof Error) {
                    return JSON.stringify({ name: err.name, message: err.message, stack: err.stack });
                }
                return JSON.stringify(err);
            } catch {
                return String(err);
            }
        };

        const unwatchTickets = wssClient.watchContractEvent({
            address: JACKPOT_CONTRACT_ADDRESS,
            abi: BLACKTREE_ABI,
            eventName: "TicketPurchased",
            onLogs: (logs) => {
                logs.forEach((log) => {
                    const { participant, newJackpot, roundId } = log.args;
                    if (participant && newJackpot !== undefined && roundId !== undefined) {
                      console.log("[Reactivity] TicketPurchased event received:", participant);
                      onTicketRef.current(participant, newJackpot, roundId);
                    }
                });
            },
            onError: (err) => {
                console.error("[Reactivity] Tickets WSS Error (Details):", safeStringifyError(err));
                console.error("[Reactivity] Tickets WSS Error (Raw):", err);
            },
        });

        const unwatchWins = wssClient.watchContractEvent({
            address: JACKPOT_CONTRACT_ADDRESS,
            abi: BLACKTREE_ABI,
            eventName: "JackpotWon",
            onLogs: (logs) => {
                logs.forEach((log) => {
                    const { roundId, first, second, third, totalPrize } = log.args;
                    if (roundId !== undefined && first && second && third && totalPrize !== undefined) {
                        console.log("[Reactivity] JACKPOT WON! Triggering cinematic...");
                        onWinRef.current(roundId, first, second, third, totalPrize);
                    }
                });
            },
            onError: (err) => {
                console.error("[Reactivity] Wins WSS Error (Details):", safeStringifyError(err));
                console.error("[Reactivity] Wins WSS Error (Raw):", err);
            },
        });

        return () => {
            console.log("[Reactivity] Cleaning up observers...");
            unwatchTickets();
            unwatchWins();
        };
    }, []);
}
