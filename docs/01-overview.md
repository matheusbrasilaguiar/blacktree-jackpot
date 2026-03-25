# 01 Overview: BlackTree — Your Onchain iGaming Platform

## The Vision

**BlackTree** is a real-time on-chain gaming platform built natively on the Somnia blockchain, powered by Somnia Reactivity. It is a consumer-facing application offering two games — a fixed-price **Jackpot** and a color-based **Double** — where every action, counter update, and draw result propagates instantly to every connected screen without any page refresh.

Every entry, bet, and prize distribution executes transparently on-chain. The frontend reacts in real-time via WebSocket push events delivered by the Somnia Reactivity SDK, creating an experience that feels live, cinematic, and trustless.

**One-line pitch:** The first on-chain iGaming platform that feels like watching a live event — not refreshing a page.

---

## The Problem

Existing on-chain jackpots and betting applications share a fundamental flaw: **they are dead experiences.**

- Users enter, close the tab, and come back later to check results.
- No real-time feedback — the jackpot size and betting pools only update after a slow page reload.
- Draw execution depends on external bots or keepers, introducing centralised points of failure.
- Zero engagement and visual feedback during the waiting period.

This is a limitation of the traditional pull (polling) model that standard EVM dApps rely on.

---

## The Solution: Somnia Reactivity

BlackTree is built on Somnia's native **push model**.

- When a new ticket is purchased, the jackpot counter updates on every connected screen instantly.
- When a new bet is placed on the Double table, the RED / BLACK / WHITE pools animate live for all spectators.
- The draw is scheduled via the `Schedule` system event and executed on-chain by a Somnia validator — no external keeper required.
- Winner reveals arrive as pushed notifications, allowing the frontend to trigger cinematic sequences synchronously across all browsers.

---

## Games

### Jackpot

Users buy a fixed-price ticket (e.g., 5 STT) to enter a round. One entry per address per round is enforced at the smart contract level. The countdown timer starts once the 2nd participant enters.

**Prize distribution:**

| Players in round | 1st Place | 2nd Place | 3rd Place | Platform fee |
|---|---|---|---|---|
| 2 players | 75% | 20% | — | 5% |
| 3+ players | 70% | 20% | 5% | 5% |

Winners are selected using a blockhash commit-reveal PRNG (`blockhash(drawBlock)` where `drawBlock` is committed 5 blocks in the future), ensuring draw fairness independent of any single party.

### Double

Players bet any amount (minimum bet, in multiples) on one of three colors before each 60-second round closes. A 15-second locked phase prevents last-second bets. At draw time, a number from 0 to 14 is drawn on-chain:

| Number | Color | Multiplier | Probability |
|---|---|---|---|
| 0 | WHITE | 14x | 1/15 (~6.7%) |
| 1 – 7 | RED | 2x | 7/15 (~46.7%) |
| 8 – 14 | BLACK | 2x | 7/15 (~46.7%) |

Winners receive their original bet multiplied by the color's payout factor, minus the 5% platform fee. Rounds are fully automatic and continuous.

---

## Platform Architecture Summary

BlackTree is a monorepo composed of three layers:

1. **Smart Contracts (Hardhat + Solidity):** Game logic, prize distribution, and on-chain Reactivity handlers.
2. **Backend (NestJS + Prisma):** Keeper service that orchestrates round lifecycle and indexes historical data to SQLite for the stats dashboard.
3. **Frontend (Next.js):** Cinematic UI consuming the Somnia Reactivity TypeScript SDK for zero-polling real-time state.

---

## "Always Alive" Demonstration Strategy

The platform includes a standalone simulation script designed for the hackathon/testnet environment. The script holds an array of funded testnet wallets and periodically calls `enter()` and `placeBet()` at randomised intervals.

The smart contracts are production-ready and expose no backdoors. The simulation script interacts with them exactly as any other user would. Its purpose is to guarantee that the live feed is always active and the cinematic draw sequences trigger naturally during judging, regardless of organic traffic.
