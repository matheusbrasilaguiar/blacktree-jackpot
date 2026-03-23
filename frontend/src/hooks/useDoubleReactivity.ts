"use client";

import { useEffect, useRef } from "react";
import { decodeEventLog, keccak256, toBytes } from "viem";
import { useReactivity } from "@/components/ReactivityProvider";

export const DOUBLE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DOUBLE_CONTRACT_ADDRESS as `0x${string}`;

const BLACKTREE_DOUBLE_ABI = [
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "player", type: "address" },
            { indexed: true, internalType: "uint8", name: "color", type: "uint8" },
            { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
            { indexed: false, internalType: "uint256", name: "newColorTotal", type: "uint256" },
            { indexed: false, internalType: "uint256", name: "roundId", type: "uint256" },
        ],
        name: "BetPlaced",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "roundId", type: "uint256" },
            { indexed: false, internalType: "uint8", name: "number", type: "uint8" },
            { indexed: true, internalType: "uint8", name: "color", type: "uint8" },
            { indexed: false, internalType: "uint256", name: "totalPayout", type: "uint256" },
        ],
        name: "RoundResult",
        type: "event",
    },
] as const;

// keccak256 of the event signatures
const TOPIC_BET_PLACED = keccak256(toBytes("BetPlaced(address,uint8,uint256,uint256,uint256)"));
const TOPIC_ROUND_RESULT = keccak256(toBytes("RoundResult(uint256,uint8,uint8,uint256)"));

type UseDoubleReactivityParams = {
    onBetPlaced: (player: string, color: number, amount: bigint, newColorTotal: bigint, roundId: bigint) => void;
    onRoundResult: (roundId: bigint, number: number, color: number, totalPayout: bigint) => void;
};

export function useDoubleReactivity({ onBetPlaced, onRoundResult }: UseDoubleReactivityParams) {
    const { sdk, isReady } = useReactivity();

    const onBetRef = useRef(onBetPlaced);
    const onResultRef = useRef(onRoundResult);

    useEffect(() => {
        onBetRef.current = onBetPlaced;
        onResultRef.current = onRoundResult;
    }, [onBetPlaced, onRoundResult]);

    useEffect(() => {
        if (!isReady || !sdk || !DOUBLE_CONTRACT_ADDRESS) {
            return;
        }

        console.log("[Double Reactivity] Starting WebSockets...");

        let unsubBets: (() => Promise<unknown>) | null = null;
        let unsubResults: (() => Promise<unknown>) | null = null;
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
            // --- Subscription 1: BetPlaced ---
            const betSub = await sdk.subscribe({
                ethCalls: [],
                eventContractSources: [DOUBLE_CONTRACT_ADDRESS],
                topicOverrides: [TOPIC_BET_PLACED],
                onData: (data: { result: { topics: `0x${string}`[]; data: `0x${string}` } }) => {
                    if (!isMounted) return;
                    try {
                        const decoded = decodeEventLog({
                            abi: BLACKTREE_DOUBLE_ABI,
                            eventName: "BetPlaced",
                            topics: data.result.topics as unknown as [`0x${string}`, ...`0x${string}`[]],
                            data: data.result.data,
                        });
                        const { player, color, amount, newColorTotal, roundId } = decoded.args as {
                            player: string;
                            color: number;
                            amount: bigint;
                            newColorTotal: bigint;
                            roundId: bigint;
                        };
                        onBetRef.current(player, color, amount, newColorTotal, roundId);
                    } catch (e) {
                        console.error("[Double Reactivity] Failed to decode BetPlaced:", safeStringifyError(e));
                    }
                },
                onError: (err: Error) => {
                    console.error("[Double Reactivity] BetPlaced err:", safeStringifyError(err));
                },
            });

            if (betSub instanceof Error) {
                console.error("[Double Reactivity] Failed BetPlaced sub:", betSub.message);
            } else {
                unsubBets = betSub.unsubscribe;
            }

            // --- Subscription 2: RoundResult ---
            const resultSub = await sdk.subscribe({
                ethCalls: [],
                eventContractSources: [DOUBLE_CONTRACT_ADDRESS],
                topicOverrides: [TOPIC_ROUND_RESULT],
                onData: (data: { result: { topics: `0x${string}`[]; data: `0x${string}` } }) => {
                    if (!isMounted) return;
                    try {
                        const decoded = decodeEventLog({
                            abi: BLACKTREE_DOUBLE_ABI,
                            eventName: "RoundResult",
                            topics: data.result.topics as unknown as [`0x${string}`, ...`0x${string}`[]],
                            data: data.result.data,
                        });
                        const { roundId, number, color, totalPayout } = decoded.args as {
                            roundId: bigint;
                            number: number;
                            color: number;
                            totalPayout: bigint;
                        };
                        onResultRef.current(roundId, number, color, totalPayout);
                    } catch (e) {
                        console.error("[Double Reactivity] Failed to decode RoundResult:", safeStringifyError(e));
                    }
                },
                onError: (err: Error) => {
                    console.error("[Double Reactivity] RoundResult err:", safeStringifyError(err));
                },
            });

            if (resultSub instanceof Error) {
                console.error("[Double Reactivity] Failed RoundResult sub:", resultSub.message);
            } else {
                unsubResults = resultSub.unsubscribe;
            }
        };

        setupSubscriptions();

        return () => {
            isMounted = false;
            console.log("[Double Reactivity] Cleaning up subscriptions...");
            if (unsubBets) unsubBets().catch(() => {});
            if (unsubResults) unsubResults().catch(() => {});
        };
    }, [sdk, isReady]);
}
