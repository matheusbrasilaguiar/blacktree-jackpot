import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";

describe("BlackTree Double", function () {
    async function deployDoubleFixture() {
        const [owner, handler, player1, player2, player3] = await hre.viem.getWalletClients();
        
        const minBet = parseEther("1"); // 1 STT min bet
        const durationInSeconds = 60n; // 60 seconds

        const blackTreeDouble = await hre.viem.deployContract("BlackTreeDouble", [minBet, durationInSeconds]);
        const publicClient = await hre.viem.getPublicClient();

        await blackTreeDouble.write.setHandler([handler.account.address]);

        return {
            blackTreeDouble,
            minBet,
            durationInSeconds,
            owner,
            handler,
            player1,
            player2,
            player3,
            publicClient
        };
    }

    it("Should structure initial deployment correctly", async function() {
        const { blackTreeDouble, minBet, durationInSeconds } = await deployDoubleFixture();
        
        expect(await blackTreeDouble.read.minBet()).to.equal(minBet);
        expect(await blackTreeDouble.read.durationInSeconds()).to.equal(durationInSeconds);
        expect(await blackTreeDouble.read.roundId()).to.equal(1n);
    });

    it("Should allow valid bets", async function() {
        const { blackTreeDouble, minBet, player1, player2 } = await deployDoubleFixture();
        
        const p1Contract = await hre.viem.getContractAt("BlackTreeDouble", blackTreeDouble.address, { client: { wallet: player1 } });
        const p2Contract = await hre.viem.getContractAt("BlackTreeDouble", blackTreeDouble.address, { client: { wallet: player2 } });

        // Bet 1 STT on RED (1)
        await p1Contract.write.placeBet([1], { value: minBet } as any);
        // Bet 5 STT on WHITE (3)
        await p2Contract.write.placeBet([3], { value: parseEther("5") } as any);

        const totals = await blackTreeDouble.read.getPoolTotals([1n]);
        expect(totals[0]).to.equal(parseEther("1")); // Red
        expect(totals[1]).to.equal(0n);              // Black
        expect(totals[2]).to.equal(parseEther("5")); // White
    });

    it("Should reject bets with invalid amounts or colors", async function() {
        const { blackTreeDouble, minBet, player1 } = await deployDoubleFixture();
        const p1Contract = await hre.viem.getContractAt("BlackTreeDouble", blackTreeDouble.address, { client: { wallet: player1 } });

        // Try betting 0.5 STT
        try {
            await p1Contract.write.placeBet([1], { value: parseEther("0.5") } as any);
            expect.fail("Should have reverted");
        } catch (e: any) { expect(e.message).to.include("InvalidBetAmount"); }
        
        // Try betting 1.5 STT (not a multiple of 1)
        try {
            await p1Contract.write.placeBet([1], { value: parseEther("1.5") } as any);
            expect.fail("Should have reverted");
        } catch (e: any) { expect(e.message).to.include("InvalidBetAmount"); }

        // Try betting invalid color (4)
        try {
            await p1Contract.write.placeBet([4], { value: minBet } as any);
            expect.fail("Should have reverted");
        } catch (e: any) {}
    });

    it("Should reject bets in the locked phase (last 15 seconds)", async function() {
        const { blackTreeDouble, minBet, player1 } = await deployDoubleFixture();
        const p1Contract = await hre.viem.getContractAt("BlackTreeDouble", blackTreeDouble.address, { client: { wallet: player1 } });

        const drawTarget = await blackTreeDouble.read.drawTargetTimestamp();
        
        // Advance time to drawTarget - 14 seconds (inside locked phase)
        await hre.network.provider.send("evm_setNextBlockTimestamp", [Number(drawTarget) - 14]);
        await hre.network.provider.send("evm_mine");

        try {
            await p1Contract.write.placeBet([1], { value: minBet } as any);
            expect.fail("Should have reverted");
        } catch(e: any) { expect(e.message).to.include("RoundNotOpen"); }
    });

    it("Should execute draw and payout accurately, keeping fees in House Vault", async function() {
        const { blackTreeDouble, handler, player1, owner, publicClient } = await deployDoubleFixture();
        const p1Contract = await hre.viem.getContractAt("BlackTreeDouble", blackTreeDouble.address, { client: { wallet: player1 } });

        // Fund bankroll with 100 STT 
        await owner.sendTransaction({ to: blackTreeDouble.address, value: parseEther("100") });
        const houseInitial = await publicClient.getBalance({ address: blackTreeDouble.address });

        // Player 1 bets 10 STT on Red
        await p1Contract.write.placeBet([1], { value: parseEther("10") } as any);
        
        const b1 = await publicClient.getBalance({ address: player1.account.address });

        // Handler executes draw: number 5, color 1(Red), multiplier 2
        const handlerContract = await hre.viem.getContractAt("BlackTreeDouble", blackTreeDouble.address, { client: { wallet: handler } });
        await handlerContract.write.executeDraw([5, 1, 2n] as any);

        const afterB1 = await publicClient.getBalance({ address: player1.account.address });
        const houseAfter = await publicClient.getBalance({ address: blackTreeDouble.address });

        // Player1 bet 10 STT. Win 20 STT. Fee 5% (1 STT). Net win = 19 STT.
        expect(afterB1 - b1).to.equal(parseEther("19"));
        
        // Fee (1 STT) must STAY in the contract balance (House Vault)
        // houseAfter should be Initial + 10 (bet) - 19 (payout) + 0 (fee not sent) = Initial - 9
        expect(houseAfter).to.equal(houseInitial - parseEther("9"));
    });

    it("Should allow Owner to withdraw funds and fail for others", async function() {
        const { blackTreeDouble, owner, player1, publicClient } = await deployDoubleFixture();
        
        // Accumulate 50 STT in house
        await player1.sendTransaction({ to: blackTreeDouble.address, value: parseEther("50") });
        const initialOwner = await publicClient.getBalance({ address: owner.account.address });

        // Player tries to withdraw (FAIL)
        const p1Contract = await hre.viem.getContractAt("BlackTreeDouble", blackTreeDouble.address, { client: { wallet: player1 } });
        try {
            await p1Contract.write.withdrawAll([]);
            expect.fail("Should have reverted");
        } catch (e: any) { expect(e.message).to.include("NotAuthorized"); }

        // Owner withdraws (SUCCESS)
        await blackTreeDouble.write.withdrawAll([]);
        const afterOwner = await publicClient.getBalance({ address: owner.account.address });
        expect(afterOwner > initialOwner).to.be.true; // Increase (accounting for gas)
        expect(await publicClient.getBalance({ address: blackTreeDouble.address })).to.equal(0n);
    });

    it("Should REVERT draw if house balance is insufficient for payouts", async function() {
        const { blackTreeDouble, handler, player1, owner } = await deployDoubleFixture();
        const p1Contract = await hre.viem.getContractAt("BlackTreeDouble", blackTreeDouble.address, { client: { wallet: player1 } });

        // Contract balance starts at 0 (or just the initial bet)
        // Player 1 bets 10 STT on Red
        await p1Contract.write.placeBet([1], { value: parseEther("10") } as any);

        // Required payout: 19 STT. Balance is only 10 STT.
        const handlerContract = await hre.viem.getContractAt("BlackTreeDouble", blackTreeDouble.address, { client: { wallet: handler } });
        
        try {
            await handlerContract.write.executeDraw([5, 1, 2n] as any);
            expect.fail("Should have reverted due to insolvency");
        } catch (e: any) {
            expect(e.message).to.include("Insufficient House Balance");
        }
    });
});
