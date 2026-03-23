"use client";

import { useEffect, useRef } from "react";
import { decodeEventLog, keccak256, toBytes } from "viem";
import { useReactivity } from "@/components/ReactivityProvider";

export const JACKPOT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_JACKPOT_CONTRACT_ADDRESS as `0x${string}`;

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

// keccak256 of the event signatures — used as topic0 filter for sdk.subscribe()
const TOPIC_TICKET_PURCHASED = keccak256(toBytes("TicketPurchased(address,uint256,uint256)"));
const TOPIC_JACKPOT_WON = keccak256(toBytes("JackpotWon(uint256,address,address,address,uint256)"));

type UseJackpotReactivityParams = {
    onTicketPurchased: (participant: string, newJackpot: bigint, roundId: bigint) => void;
    onJackpotWon: (roundId: bigint, first: string, second: string, third: string, totalPrize: bigint) => void;
};

export function useJackpotReactivity({ onTicketPurchased, onJackpotWon }: UseJackpotReactivityParams) {
    const { sdk, isReady } = useReactivity();

    const onTicketRef = useRef(onTicketPurchased);
    const onWinRef = useRef(onJackpotWon);

    useEffect(() => {
        onTicketRef.current = onTicketPurchased;
        onWinRef.current = onJackpotWon;
    }, [onTicketPurchased, onJackpotWon]);

    useEffect(() => {
        if (!isReady || !sdk) {
            console.log("[Reactivity SDK] Waiting for SDK to be ready...");
            return;
        }

        console.log("[Reactivity SDK] Starting Somnia Reactivity subscriptions...");

        let unsubTickets: (() => Promise<unknown>) | null = null;
        let unsubWins: (() => Promise<unknown>) | null = null;
        let isMounted = true;

        const safeStringifyError = (err: unknown) => {
            try {
                if (err instanceof Error) return err.message;
                return JSON.stringify(err);
            } catch {
                return String(err);
            }
        };

        const setupSubscriptions = async () => {
            // --- Subscription 1: TicketPurchased ---
            const ticketSub = await sdk.subscribe({
                ethCalls: [],
                eventContractSources: [JACKPOT_CONTRACT_ADDRESS],
                topicOverrides: [TOPIC_TICKET_PURCHASED],
                onData: (data: { result: { topics: `0x${string}`[]; data: `0x${string}` } }) => {
                    if (!isMounted) return;
                    try {
                        const decoded = decodeEventLog({
                            abi: BLACKTREE_ABI,
                            eventName: "TicketPurchased",
                            topics: data.result.topics as unknown as [`0x${string}`, ...`0x${string}`[]],
                            data: data.result.data,
                        });
                        const { participant, newJackpot, roundId } = decoded.args as {
                            participant: string;
                            newJackpot: bigint;
                            roundId: bigint;
                        };
                        console.log("[Reactivity SDK] TicketPurchased event received:", participant);
                        onTicketRef.current(participant, newJackpot, roundId);
                    } catch (e) {
                        console.error("[Reactivity SDK] Failed to decode TicketPurchased:", safeStringifyError(e));
                    }
                },
                onError: (err: Error) => {
                    console.error("[Reactivity SDK] TicketPurchased subscription error:", safeStringifyError(err));
                },
            });

            if (ticketSub instanceof Error) {
                console.error("[Reactivity SDK] Failed to start TicketPurchased subscription:", ticketSub.message);
            } else {
                unsubTickets = ticketSub.unsubscribe;
                console.log("[Reactivity SDK] TicketPurchased subscription active, id:", ticketSub.subscriptionId);
            }

            // --- Subscription 2: JackpotWon ---
            const winSub = await sdk.subscribe({
                ethCalls: [],
                eventContractSources: [JACKPOT_CONTRACT_ADDRESS],
                topicOverrides: [TOPIC_JACKPOT_WON],
                onData: (data: { result: { topics: `0x${string}`[]; data: `0x${string}` } }) => {
                    if (!isMounted) return;
                    try {
                        const decoded = decodeEventLog({
                            abi: BLACKTREE_ABI,
                            eventName: "JackpotWon",
                            topics: data.result.topics as unknown as [`0x${string}`, ...`0x${string}`[]],
                            data: data.result.data,
                        });
                        const { roundId, first, second, third, totalPrize } = decoded.args as {
                            roundId: bigint;
                            first: string;
                            second: string;
                            third: string;
                            totalPrize: bigint;
                        };
                        console.log("[Reactivity SDK] JACKPOT WON! Triggering cinematic...");
                        onWinRef.current(roundId, first, second, third, totalPrize);
                    } catch (e) {
                        console.error("[Reactivity SDK] Failed to decode JackpotWon:", safeStringifyError(e));
                    }
                },
                onError: (err: Error) => {
                    console.error("[Reactivity SDK] JackpotWon subscription error:", safeStringifyError(err));
                },
            });

            if (winSub instanceof Error) {
                console.error("[Reactivity SDK] Failed to start JackpotWon subscription:", winSub.message);
            } else {
                unsubWins = winSub.unsubscribe;
                console.log("[Reactivity SDK] JackpotWon subscription active, id:", winSub.subscriptionId);
            }
        };

        setupSubscriptions();

        return () => {
            isMounted = false;
            console.log("[Reactivity SDK] Cleaning up subscriptions...");
            if (unsubTickets) unsubTickets().catch(() => {});
            if (unsubWins) unsubWins().catch(() => {});
        };
    }, [sdk, isReady]);
}
