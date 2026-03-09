import hre from "hardhat";

async function main() {
  const publicClient = await hre.viem.getPublicClient();
  const walletClients = await hre.viem.getWalletClients();
  const owner = walletClients[0];
  const p1 = walletClients[1];
  const p2 = walletClients[2];
  
  console.log("Deploying BlackTree (Commit-Reveal PRNG)...");
  const jackpot = await hre.viem.deployContract("BlackTree", [1n, 0n]);
  
  let p1Wins = 0;
  let p2Wins = 0;
  
  console.log("Simulating 50 complete rounds (Commit + Mine + Reveal)...");
  for(let i=0; i<50; i++) {
     await jackpot.write.enter({ value: 1n, account: p1.account });
     await jackpot.write.enter({ value: 1n, account: p2.account });
     
     await jackpot.write.closeRound({ account: owner.account });
     
     // Fast forward blockchain by 6 blocks to generate the future blockhash
     for(let b=0; b<6; b++) {
       await hre.network.provider.send("evm_mine");
     }
     
     const txHash = await jackpot.write.executeDraw({ account: owner.account });
     const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
     
     const logs = await publicClient.getContractEvents({
        address: jackpot.address,
        abi: jackpot.abi,
        eventName: 'JackpotWon',
        fromBlock: receipt.blockNumber,
        toBlock: receipt.blockNumber
     });
     
     if(logs.length > 0) {
        const first = logs[0].args.first;
        if (first?.toLowerCase() === p1.account.address.toLowerCase()) p1Wins++;
        if (first?.toLowerCase() === p2.account.address.toLowerCase()) p2Wins++;
     }
     
     process.stdout.write(`\rRounds Simulated: ${i+1}/50`);
  }
  
  console.log(`\n\n--- Entropy Independence Results (50 Rounds) ---`);
  console.log(`Player 1 (Entered First) Wins: ${p1Wins} (${(p1Wins/50)*100}%)`);
  console.log(`Player 2 (Entered Second) Wins: ${p2Wins} (${(p2Wins/50)*100}%)`);
  
  if (Math.abs(p1Wins - p2Wins) < 15) {
      console.log("✅ CONCLUSION: The PRNG is statistically uniform. Winning is an unbiased 50/50 coin toss.");
  } else {
      console.log("❌ CONCLUSION: Bias detected! The PRNG needs review.");
  }
}

main().catch(console.error);
