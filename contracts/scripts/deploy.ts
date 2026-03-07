import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
    console.log("Starting deployment on Somnia Testnet...");

    const publicClient = await hre.viem.getPublicClient();
    const [deployer] = await hre.viem.getWalletClients();

    console.log("Deploying contracts with the account:", deployer.account.address);

    const balance = await publicClient.getBalance({ address: deployer.account.address });
    console.log("Account balance:", balance.toString());

    // 1. Deploy the BlackTree contract
    const ticketPrice = parseEther("1"); // 1 STT
    const durationInBlocks = 300n; // 300 blocks (~5 mins on Somnia)

    console.log("Deploying BlackTree with ticketPrice: 1 STT, duration: 300 blocks");
    const blackTree = await hre.viem.deployContract("BlackTree", [ticketPrice, durationInBlocks]);
    console.log("BlackTree deployed to:", blackTree.address);

    // 2. We skip JackpotHandler for now since it needs Somnia Reactivity to be registered via Subscriptions
    // To keep it simple, the deployer will act as the mock handler, or we deploy it next.
    console.log("Setting deployer as allowed Handler for local testnet testing...");
    await blackTree.write.setHandler([deployer.account.address]);
    console.log("Handler correctly set to:", deployer.account.address);

    console.log("--- Deployment Complete ---");
    console.log("To verify run:");
    console.log(`npx hardhat verify --network somnia ${blackTree.address} "${ticketPrice}" "${durationInBlocks}"`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
