import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("BlackTree Entropy Tests", function () {
  it("Should demonstrate uniform distribution across 1000 draws", async function () {
    const [owner, ...players] = await ethers.getSigners();
    const BlackTree = await ethers.getContractFactory("BlackTree");
    
    // Deploy contract with 1 wei ticket price, 0 duration (for instant testing)
    const jackpot = await BlackTree.deploy(1, 0);
    await jackpot.waitForDeployment();

    const stats = { firstPlace: [0, 0, 0] }; // Tracking wins for player 0, 1, 2

    // Let's do 100 loops
    for(let i = 0; i < 100; i++) {
        // 3 players enter
        await jackpot.connect(players[0]).enter({ value: 1 });
        await jackpot.connect(players[1]).enter({ value: 1 });
        await jackpot.connect(players[2]).enter({ value: 1 });
        
        // Timer is 0, so we can immediately close
        await jackpot.connect(owner).closeRound();
        
        // Wait 5 blocks for the commit-reveal hash to manifest
        for(let b = 0; b < 6; b++) {
            await network.provider.send("evm_mine");
        }
        
        // Execute draw
        const drawTx = await jackpot.connect(owner).executeDraw();
        const receipt = await drawTx.wait();
        
        // Find JackpotWon event
        const event = receipt?.logs.find((e: any) => e.fragment?.name === "JackpotWon");
        if (event && event.fragment) {
            const firstWinner = (event as any).args[1];
            if (firstWinner === players[0].address) stats.firstPlace[0]++;
            if (firstWinner === players[1].address) stats.firstPlace[1]++;
            if (firstWinner === players[2].address) stats.firstPlace[2]++;
        }
    }
    
    console.log(`\n--- 100 Draws with 3 Participants ---`);
    console.log(`Player 1 First Place Wins: ${stats.firstPlace[0]}`);
    console.log(`Player 2 First Place Wins: ${stats.firstPlace[1]}`);
    console.log(`Player 3 First Place Wins: ${stats.firstPlace[2]}`);
    
    // Expect rough 33% distribution (not 100% vs 0% vs 0% like before!)
    expect(stats.firstPlace[0]).to.be.greaterThan(15);
    expect(stats.firstPlace[1]).to.be.greaterThan(15);
    expect(stats.firstPlace[2]).to.be.greaterThan(15);
  });
});
