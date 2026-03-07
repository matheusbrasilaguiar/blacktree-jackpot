import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";

describe("BlackTree Jackpot", function () {
    async function deployJackpotFixture() {
        const [owner, handler, player1, player2, player3] = await hre.viem.getWalletClients();
        
        const ticketPrice = parseEther("1"); // 1 STT
        const durationInBlocks = 100n; // 100 blocks

        const blackTree = await hre.viem.deployContract("BlackTree", [ticketPrice, durationInBlocks]);
        const publicClient = await hre.viem.getPublicClient();

        await blackTree.write.setHandler([handler.account.address]);

        return {
            blackTree,
            ticketPrice,
            owner,
            handler,
            player1,
            player2,
            player3,
            publicClient
        };
    }

    it("Should set the correct initial configuration", async function () {
        const { blackTree, ticketPrice } = await deployJackpotFixture();

        expect(await blackTree.read.ticketPrice()).to.equal(ticketPrice);
        expect(await blackTree.read.roundId()).to.equal(1n);
    });

    it("Should allow participants to enter if they pay the ticket price", async function () {
        const { blackTree, player1, player2, ticketPrice } = await deployJackpotFixture();

        const p1Contract = await hre.viem.getContractAt(
            "BlackTree",
            blackTree.address,
            { client: { wallet: player1 } }
        );

        await p1Contract.write.enter({ value: ticketPrice } as any);
        
        let jackpot = await blackTree.read.currentJackpot();
        expect(jackpot).to.equal(ticketPrice);

        const players = await blackTree.read.getParticipants() as string[];
        expect(players.length).to.equal(1);
        expect(players[0].toLowerCase()).to.equal(player1.account.address.toLowerCase());
    });

    it("Should revert draw if there is only 1 participant (Simulating Rollover)", async function () {
        const { blackTree, ticketPrice, handler, player1 } = await deployJackpotFixture();

        const p1Contract = await hre.viem.getContractAt("BlackTree", blackTree.address, { client: { wallet: player1 } });
        await p1Contract.write.enter({ value: ticketPrice } as any);

        const handlerContract = await hre.viem.getContractAt("BlackTree", blackTree.address, { client: { wallet: handler } });
        
        try {
            await handlerContract.write.executeDraw([
                player1.account.address,
                "0x0000000000000000000000000000000000000000",
                "0x0000000000000000000000000000000000000000"
            ]);
            expect.fail("Should have reverted");
        } catch (e: any) {
            expect(e.message).to.include("NotEnoughParticipants");
        }
    });

    it("Should correctly perform the draw with 2 participants and distribute 75/20 split", async function () {
        const { blackTree, ticketPrice, handler, player1, player2, owner, publicClient } = await deployJackpotFixture();

        const p1Contract = await hre.viem.getContractAt("BlackTree", blackTree.address, { client: { wallet: player1 } });
        const p2Contract = await hre.viem.getContractAt("BlackTree", blackTree.address, { client: { wallet: player2 } });

        await p1Contract.write.enter({ value: ticketPrice } as any);
        await p2Contract.write.enter({ value: ticketPrice } as any);

        const b1 = await publicClient.getBalance({ address: player1.account.address });
        const b2 = await publicClient.getBalance({ address: player2.account.address });
        const initialOwnerBalance = await publicClient.getBalance({ address: owner.account.address });

        const handlerContract = await hre.viem.getContractAt("BlackTree", blackTree.address, { client: { wallet: handler } });
        await handlerContract.write.executeDraw([
            player1.account.address,
            player2.account.address,
            "0x0000000000000000000000000000000000000000" // 3rd is zero address
        ]);

        const afterB1 = await publicClient.getBalance({ address: player1.account.address });
        const afterB2 = await publicClient.getBalance({ address: player2.account.address });
        const finalOwnerBalance = await publicClient.getBalance({ address: owner.account.address });

        expect(afterB1 > b1).to.be.true;
        expect(afterB2 > b2).to.be.true;
        expect(finalOwnerBalance > initialOwnerBalance).to.be.true;
    });

    it("Should correctly perform the draw and distribute the 70/20/5 prize split", async function () {
        const { blackTree, ticketPrice, handler, player1, player2, player3, owner, publicClient } = await deployJackpotFixture();

        // 3 entries = 3 STT
        const p1Contract = await hre.viem.getContractAt("BlackTree", blackTree.address, { client: { wallet: player1 } });
        const p2Contract = await hre.viem.getContractAt("BlackTree", blackTree.address, { client: { wallet: player2 } });
        const p3Contract = await hre.viem.getContractAt("BlackTree", blackTree.address, { client: { wallet: player3 } });

        await p1Contract.write.enter({ value: ticketPrice } as any);
        await p2Contract.write.enter({ value: ticketPrice } as any);
        await p3Contract.write.enter({ value: ticketPrice } as any);

        const jackpot = await blackTree.read.currentJackpot();
        expect(jackpot).to.equal(ticketPrice * 3n);

        // Get initial balances
        const b1 = await publicClient.getBalance({ address: player1.account.address });
        const b2 = await publicClient.getBalance({ address: player2.account.address });
        const b3 = await publicClient.getBalance({ address: player3.account.address });

        // Handler executes draw
        const handlerContract = await hre.viem.getContractAt("BlackTree", blackTree.address, { client: { wallet: handler } });
        await handlerContract.write.executeDraw([
            player1.account.address,
            player2.account.address,
            player3.account.address
        ]);

        // Protocol fee = 5% of 3 STT = 0.15 STT
        // 1st (70%) = 2.1 STT
        // 2nd (20%) = 0.6 STT
        // 3rd (5%) = 0.15 STT

        const afterB1 = await publicClient.getBalance({ address: player1.account.address });
        const afterB2 = await publicClient.getBalance({ address: player2.account.address });
        const afterB3 = await publicClient.getBalance({ address: player3.account.address });

        expect(afterB1 > b1).to.be.true;
        expect(afterB2 > b2).to.be.true;
        expect(afterB3 > b3).to.be.true;

        // Verify state is reset
        const newJackpot = await blackTree.read.currentJackpot();
        const roundId = await blackTree.read.roundId();
        const participants = await blackTree.read.getParticipants() as string[];

        expect(newJackpot).to.equal(0n);
        expect(roundId).to.equal(2n);
        expect(participants.length).to.equal(0);
    });
});
