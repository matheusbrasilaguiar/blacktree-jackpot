import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
    console.log("Starting BlackTree Double deployment on Somnia Testnet...");

    const publicClient = await hre.viem.getPublicClient();
    const [deployer] = await hre.viem.getWalletClients();

    console.log("Deploying contracts with the account:", deployer.account.address);

    const balance = await publicClient.getBalance({ address: deployer.account.address });
    console.log("Account balance:", balance.toString());

    // 1. Deploy BlackTreeDouble
    const minBet = parseEther("1"); // 1 STT
    const durationInSeconds = 60n; // 60 seconds

    console.log(`Deploying BlackTreeDouble with minBet: 1 STT, duration: 60 seconds`);
    const blackTreeDouble = await hre.viem.deployContract("BlackTreeDouble", [minBet, durationInSeconds]);
    console.log("BlackTreeDouble deployed to:", blackTreeDouble.address);

    // 2. Deploy DoubleHandler
    console.log("Deploying DoubleHandler...");
    const doubleHandler = await hre.viem.deployContract("DoubleHandler", [blackTreeDouble.address]);
    console.log("DoubleHandler deployed to:", doubleHandler.address);

    // 3. Set the handler in the main contract
    console.log("Setting doubleHandler as the allowed Handler in BlackTreeDouble...");
    await blackTreeDouble.write.setHandler([doubleHandler.address]);
    console.log("Handler set successfully!");

    // 4. Also fund the game with a 15 STT bankroll temporarily to ensure payouts don't fail during testing
    console.log("Funding BlackTreeDouble with 15 STT house bankroll...");
    const tx = await deployer.sendTransaction({
        to: blackTreeDouble.address,
        value: parseEther("15")
    });
    console.log(`Funded bankroll in tx: ${tx}`);

    console.log("--- Deployment Complete ---");
    console.log("BlackTreeDouble:", blackTreeDouble.address);
    console.log("DoubleHandler:", doubleHandler.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
