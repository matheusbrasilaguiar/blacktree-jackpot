const { createPublicClient, createWalletClient, http, parseAbi } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { somniaTestnet } = require("./somniaChain");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../contracts/.env") });
dotenv.config({ path: path.resolve(__dirname, "../frontend/.env.local"), override: false });

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_JACKPOT_CONTRACT_ADDRESS;

if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
    console.error("Missing PRIVATE_KEY in ../contracts/.env or NEXT_PUBLIC_JACKPOT_CONTRACT_ADDRESS in ../frontend/.env.local");
    process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`);

const publicClient = createPublicClient({
    chain: somniaTestnet,
    transport: http()
});

const walletClient = createWalletClient({
    account,
    chain: somniaTestnet,
    transport: http()
});

const abi = parseAbi([
    "function drawTargetTimestamp() view returns (uint256)",
    "function getParticipants() view returns (address[])",
    "function executeDraw() external"
]);

// 1 second interval to match the Somnia block times
const POLL_INTERVAL = 1000;
let isExecuting = false;

async function checkAndDraw() {
    if (isExecuting) return;

    try {
        const [targetTimestamp, participants] = await Promise.all([
            publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: "drawTargetTimestamp"
            }),
            publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: "getParticipants"
            })
        ]);

        const target = Number(targetTimestamp);
        const playerCount = participants.length;
        const now = Math.floor(Date.now() / 1000);

        if (target > 0 && playerCount >= 2 && now >= target) {
            isExecuting = true;
            console.log(`[${new Date().toISOString()}] Target reached! Triggering executeDraw()...`);

            try {
                // To avoid gas estimation errors on full blocks, we can just use a fast static fee or rely on viem defaults
                const { request } = await publicClient.simulateContract({
                    account,
                    address: CONTRACT_ADDRESS,
                    abi,
                    functionName: 'executeDraw'
                });

                const hash = await walletClient.writeContract(request);
                console.log(`[${new Date().toISOString()}] Transaction Sent: ${hash}`);

                await publicClient.waitForTransactionReceipt({ hash });
                console.log(`[${new Date().toISOString()}] Transaction Confirmed! Draw successful.`);
            } catch (txError) {
                console.error(`[${new Date().toISOString()}] Failed to execute draw:`, txError);
            } finally {
                // Wait a few seconds before unblocking to allow the contract state to update
                setTimeout(() => { isExecuting = false; }, 5000);
            }
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error reading contract state:`, error);
    }
}

console.log("==========================================");
console.log(" BlackTree Jackpot Keeper Started!");
console.log(` Target Contract: ${CONTRACT_ADDRESS}`);
console.log(` Admin Account: ${account.address}`);
console.log("==========================================");

setInterval(checkAndDraw, POLL_INTERVAL);
