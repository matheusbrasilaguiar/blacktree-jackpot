# 01 Overview: BlackTree Jackpot

## The Vision

**BlackTree** is a real-time on-chain jackpot built natively on the Somnia blockchain, powered by Somnia Reactivity. It is a consumer-facing application where users buy fixed-price tickets to compete for a prize pool that grows visibly in real-time — without any backend server, keeper bot, or centralized infrastructure.

Every entry, jackpot update, and draw executes transparently on-chain. The frontend reacts instantly via WebSocket push events, creating an experience that feels live, cinematic, and trustless.

**One-line pitch:** The first on-chain jackpot that feels like watching a live event — not refreshing a page.

## The Problem

Existing on-chain jackpots and lotteries share a fundamental flaw: **they are dead experiences.**
- Users enter, close the tab, and come back later to check results.
- No real-time feedback — the jackpot size only updates after a slow page reload.
- Draw execution depends on external bots or keepers, introducing centralized points of failure.
- Zero engagement during the waiting period.

This is a limitation of the traditional pull (polling) model that standard EVM dApps rely on.

## The Solution (Somnia Reactivity)

BlackTree is built on Somnia's native **push model**.
- When a new ticket is purchased, the jackpot counter updates on every connected screen instantly, without user action.
- The draw is scheduled via the `Schedule` system event and executes automatically at the exact target block by a validator.
- The winner reveal arrives as a pushed notification, allowing the frontend to react cinematically.
- **No backend. No bot. No trust required.**

## Prize Distribution Rules

- **Ticket model:** Fixed price (e.g., 5 STT)
- **Round duration:** Defined at deployment (e.g., minutes to 1 hour for the hackathon MVP)
- **Distribution:**
  - 1st place: 70% of prize pool
  - 2nd place: 20% of prize pool
  - 3rd place: 10% of prize pool
- **Protocol fee:** 5% of total jackpot per round (withheld before distribution)

## The Hackathon "Always Alive" Strategy (Simulation Bot)

To ensure the product demonstration always feels active and cinematic, even with low organic traffic during the hackathon judging phase, we will implement a **Simulation Bot**.
- This is a localized Node.js script holding several automated testnet wallets funded with test STT.
- The script will periodically call the `enter()` function at randomized intervals.
- Crucially, the **Smart Contracts remain 100% production-ready**. The bot does not interact with backdoors; it simply acts like any other human participant on the network.
- This guarantees the UI's live feed is always updating, the jackpot is always growing, and the cinematic draw triggers organically.
