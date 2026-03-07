import { ethers } from "hardhat";

async function main() {
    const Contract = await ethers.getContractFactory("BlackTree");
    const jackpot = await Contract.attach("0x2d93d9d5fda6524db85f60c42f33af192e129f86");
    
    const targetBlock = await jackpot.drawTargetBlock();
    console.log("Draw Target Block:", targetBlock.toString());
    
    const participants = await jackpot.getParticipants();
    console.log("Participants length:", participants.length);
    
    const currentBlock = await ethers.provider.getBlockNumber();
    console.log("Current Block:", currentBlock);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
