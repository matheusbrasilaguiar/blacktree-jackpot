"use client";

import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { parseEther } from "viem";
import { DOUBLE_CONTRACT_ADDRESS } from "./useDoubleReactivity";

export const DOUBLE_ABI_READ = [
    {
        inputs: [],
        name: "state",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "roundId",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "drawTargetTimestamp",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPoolTotals",
        outputs: [
            { internalType: "uint256", name: "red", type: "uint256" },
            { internalType: "uint256", name: "black", type: "uint256" },
            { internalType: "uint256", name: "white", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

export const DOUBLE_ABI_WRITE = [
    {
        inputs: [{ internalType: "uint8", name: "_color", type: "uint8" }],
        name: "placeBet",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
] as const;

export function useDoubleContract() {
    const { address } = useAccount();

    const { writeContractAsync, isPending: isBetting } = useWriteContract();

    const { data: contractState, refetch: refetchState } = useReadContract({
        address: DOUBLE_CONTRACT_ADDRESS,
        abi: DOUBLE_ABI_READ,
        functionName: "state",
        query: { refetchInterval: 5000 },
    });

    const { data: drawTargetTimestamp, refetch: refetchTimestamp } = useReadContract({
        address: DOUBLE_CONTRACT_ADDRESS,
        abi: DOUBLE_ABI_READ,
        functionName: "drawTargetTimestamp",
        query: { refetchInterval: 5000 },
    });

    const { data: roundIdData, refetch: refetchRoundId } = useReadContract({
        address: DOUBLE_CONTRACT_ADDRESS,
        abi: DOUBLE_ABI_READ,
        functionName: "roundId",
        query: { refetchInterval: 5000 },
    });

    const placeBet = async (color: number, amountStt: string) => {
        if (!address) throw new Error("Wallet not connected");

        const tx = await writeContractAsync({
            address: DOUBLE_CONTRACT_ADDRESS,
            abi: DOUBLE_ABI_WRITE,
            functionName: "placeBet",
            args: [color],
            value: parseEther(amountStt),
        });

        return tx;
    };

    return {
        contractState,
        drawTargetTimestamp,
        placeBet,
        isBetting,
        refetchState,
        refetchTimestamp,
        roundId: roundIdData,
        refetchRoundId,
    };
}
