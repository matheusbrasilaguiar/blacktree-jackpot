# BlackTree — Product Vision Document

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-03-05  
**Scope:** Hackathon MVP — Somnia Reactivity Mini Hackathon (DoraHacks)

---

## 1. Overview

**BlackTree** is a real-time on-chain jackpot built on the Somnia blockchain, powered natively by Somnia Reactivity. It is a consumer-facing application where users buy fixed-price tickets to compete for a prize pool that grows visibly in real-time — without any backend server, keeper bot, or centralized infrastructure.

Every entry, every jackpot update, and every draw executes transparently on-chain. The frontend reacts to blockchain events instantly via WebSocket push, creating an experience that feels live, cinematic, and trustless.

> **One-line pitch:** The first on-chain jackpot that feels like watching a live event — not refreshing a page.

---

## 2. Problem

Existing on-chain jackpots and lotteries share the same fundamental flaw: **they are dead experiences.**

- Users enter, close the tab, and come back later to check results
- No real-time feedback — jackpot size only updates after a page reload
- Draw execution depends on external bots or keepers (centralized risk)
- Zero engagement during the waiting period between entry and result

This is not a technical limitation of blockchain in general — it is a limitation of the traditional **pull model** (polling), which every existing EVM dApp relies on.

---

## 3. Solution

BlackTree is built on Somnia's native **push model** — the Reactivity system — which eliminates polling entirely.

- When a new ticket is purchased, the jackpot counter updates on every connected screen **instantly**, without any user action
- The draw is scheduled via the `Schedule` system event and executed automatically at the exact target block by a validator
- The winner reveal arrives as a pushed notification — the frontend reacts cinematically without any manual trigger
- No backend. No bot. No trust required.

This makes BlackTree the first jackpot where **the waiting period is the product** — an active, live, shared experience.

---

## 4. Target Audience

### Primary — Crypto-native casual players

Users already holding crypto wallets and tokens who are comfortable with on-chain transactions. They treat small jackpot entries as low-stakes entertainment with asymmetric upside. They enter impulsively when the jackpot is visibly large.

### Secondary — Online casino players

Users already spending money on slots, roulette, or sports betting platforms. Their core motivation is the **feeling** — tension, anticipation, the reveal moment. BlackTree captures this feeling while offering something traditional casinos cannot: a provably fair, publicly verifiable, manipulation-proof draw.

### Tertiary — Somnia ecosystem early adopters

Developers, enthusiasts, and speculators exploring the Somnia network. They participate to experience the ecosystem, not necessarily to win. They are the organic distribution channel — they share, post, and bring others in.

---

## 5. Product Description

### 5.1 Core Flow

```text
User opens app
    → Sees live jackpot growing in real-time
    → Sees live feed of other participants entering
    → Pays fixed ticket price in STT to enter
    → Watches countdown to draw
    → Draw executes automatically on-chain
    → Top 3 winners revealed cinematically on screen
    → New round begins immediately
```

### 5.2 Key Rules

| Parameter | Value |
|---|---|
| Ticket model | Fixed price — everyone pays the same |
| Ticket price | Fixed amount in STT (defined at deploy) |
| Round duration | Short (minutes to ~1 hour, defined at deploy) |
| Prize distribution | 1st place: 70% · 2nd place: 20% · 3rd place: 10% |
| Protocol fee | 5% of total jackpot per round |
| Draw mechanism | Automatic via Somnia `Schedule` system event |
| Randomness | `block.prevrandao` + `block.timestamp` (hackathon scope) |
| Minimum participants | 3 (required to fill all prize positions) |

### 5.3 Prize Distribution Example

> Jackpot: 1,000 STT (200 participants × 5 STT ticket)

| Recipient | Share | Amount |
|---|---|---|
| 1st place | 70% of 95% | 665 STT |
| 2nd place | 20% of 95% | 190 STT |
| 3rd place | 10% of 95% | 95 STT |
| Protocol fee | 5% | 50 STT |

---

## 6. Somnia Reactivity — Integration Map

This section maps every Reactivity feature to its specific role in BlackTree. This is the technical differentiator of the product.

| Reactivity Feature | Role in BlackTree |
|---|---|
| **WebSocket off-chain subscription** | Frontend receives `TicketPurchased` events and updates jackpot counter in real-time without polling |
| **State Consistency** | Jackpot value pushed alongside the event is always consistent with the exact block — no race conditions |
| **`Schedule` system event** | Draw is triggered automatically at a pre-set timestamp — no keeper, no bot, no manual call |
| **On-chain Solidity handler** | `JackpotHandler.sol` is invoked by the validator at draw time, selects winners, distributes prizes, and schedules the next round |
| **`BlockTick` system event** | Powers the countdown timer and the live pulse animation on the UI — updates ~10x per second |

> BlackTree uses all major Reactivity primitives simultaneously, each with a clear, justified purpose.

---

## 7. Architecture Overview

```text
┌─────────────────────────────────────────────────┐
│                  FRONTEND (React)                │
│                                                  │
│  ┌─────────────┐   ┌──────────────┐             │
│  │ Jackpot     │   │  Live Feed   │             │
│  │ Counter     │   │  (entries)   │             │
│  │ (WebSocket) │   │  (WebSocket) │             │
│  └─────────────┘   └──────────────┘             │
│                                                  │
│  ┌─────────────┐   ┌──────────────┐             │
│  │ Countdown   │   │  Enter       │             │
│  │ (BlockTick) │   │  Button      │             │
│  └─────────────┘   └──────────────┘             │
└──────────────────────┬──────────────────────────┘
                       │ WebSocket (Somnia Reactivity SDK)
┌──────────────────────▼──────────────────────────┐
│             SOMNIA REACTIVITY LAYER              │
│                                                  │
│  Subscription 1: TicketPurchased → frontend      │
│  Subscription 2: JackpotWon → frontend           │
│  Subscription 3: Schedule → JackpotHandler       │
│  Subscription 4: BlockTick → countdown           │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              SMART CONTRACTS (Solidity)          │
│                                                  │
│  BlackTree.sol          JackpotHandler.sol       │
│  ─────────────          ──────────────────       │
│  • enter()              • _onEvent()             │
│  • getJackpot()         • _drawWinners()         │
│  • getParticipants()    • _distribute()          │
│  • TicketPurchased      • _scheduleNext()        │
│  • JackpotWon                                    │
└─────────────────────────────────────────────────┘
```

---

## 8. Smart Contracts

### 8.1 `BlackTree.sol` — Main Contract

Responsible for accepting entries, tracking participants, and holding the prize pool.

**Key functions:**
- `enter()` — payable, validates ticket price, registers participant, emits `TicketPurchased`
- `getJackpot()` — view, returns current jackpot value
- `getParticipants()` — view, returns participant list for the current round
- `reset()` — internal, called by handler after draw to start new round

**Key events:**
- `TicketPurchased(address indexed participant, uint256 newJackpot)`
- `JackpotWon(address first, address second, address third, uint256 totalPrize)`

### 8.2 `JackpotHandler.sol` — Reactivity Handler

Implements `SomniaEventHandler`. Invoked automatically by the validator at the scheduled draw timestamp.

**Key functions:**
- `_onEvent()` — entry point called by Somnia validator
- `_drawWinners()` — selects 3 unique winners using on-chain randomness
- `_distribute()` — transfers prizes (70/20/10) and protocol fee (5%)
- `_scheduleNext()` — creates a new `Schedule` subscription for the next round

---

## 9. Frontend Experience

### 9.1 Key Screens

**Main Screen (single page, always visible):**
- Live jackpot counter — animates on every new entry
- Live entries feed — new participants slide in from top in real-time
- Countdown to draw — powered by `BlockTick`
- Round stats — participants count, ticket price, prize breakdown
- Enter button — triggers wallet transaction

**Draw Sequence (cinematic, ~10 seconds):**
1. New entries stop — screen dims
2. "DRAW EXECUTING ON-CHAIN..." message appears
3. Winner selection animation — addresses flicker rapidly
4. Screen flash → winners revealed with prize amounts
5. Confetti/particle explosion
6. Jackpot resets — new round begins

### 9.2 Real-Time Data Flow

Every piece of data on screen comes from Reactivity push — **nothing is polled:**

| UI Element | Data Source |
|---|---|
| Jackpot value | `TicketPurchased` event + `getJackpot()` state call |
| Entries feed | `TicketPurchased` event stream |
| Countdown | `BlockTick` subscription |
| Winners | `JackpotWon` event |

---

## 10. Out of Scope (v1)

The following features are **intentionally excluded** from the hackathon version to maintain focus and execution quality:

| Feature | Reason Excluded |
|---|---|
| No-loss / yield mechanism | Requires DeFi integration; low yield at small volumes |
| B2B multi-pool dashboard | Future roadmap — not needed for consumer demo |
| NFT participation tickets | Adds scope without core value for v1 |
| Social / chat features | Out of core product loop |
| Chainlink VRF randomness | Production concern — `prevrandao` sufficient for hackathon |
| Mobile-native app | Web app sufficient for demo |

---

## 11. Future Roadmap

These items are out of scope for v1 but represent the natural growth path of the product:

- **B2B SDK** — allow any casino, game, or DeFi protocol to deploy their own BlackTree pool with custom configuration
- **Multi-pool** — simultaneous jackpots at different ticket prices and durations
- **NFT tickets** — each entry mints a unique collectible NFT tied to that round
- **Verifiable randomness** — replace `prevrandao` with Chainlink VRF or commit-reveal scheme
- **Progressive jackpot** — a portion of each round rolls over to seed the next, creating accumulating mega-prizes
- **Referral system** — participants earn a small fee when someone they referred wins

---

## 12. Why BlackTree Wins the Hackathon

| Criterion | BlackTree's Answer |
|---|---|
| **Technical excellence** | Uses every major Reactivity primitive — WebSocket, Schedule, BlockTick, on-chain handler — each with clear purpose |
| **Reactivity usage** | The product is *impossible* to build with the same UX without Reactivity — it's not a nice-to-have, it's the foundation |
| **Deployed on testnet** | Full contract + handler + subscriptions deployed and live |
| **Real-world potential** | Clear monetization (protocol fee), obvious market (online gambling), scalable B2B path |
| **Demo quality** | A judge opens the screen and *feels* the product working — no explanation needed |

---

## 13. Glossary

| Term | Definition |
|---|---|
| **STT** | Native token of Somnia Testnet — used for gas and ticket payments in the hackathon context |
| **SOMI** | Native token of Somnia Mainnet — the production equivalent of STT |
| **Reactivity** | Somnia's native pub/sub push system — delivers on-chain events and state to subscribers without polling |
| **Schedule** | Somnia system event that triggers a handler at a specific future timestamp — used for automatic draw execution |
| **BlockTick** | Somnia system event that fires every block (~10x/second) — used for countdown and live animations |
| **Handler** | A Solidity smart contract implementing `SomniaEventHandler` that gets invoked automatically by validators when subscribed events occur |
| **Subscription** | A configured listener that defines which events to watch and which handler or WebSocket callback to notify |
| **Jackpot** | The accumulated prize pool for a given round, funded entirely by ticket purchases |
| **Round** | A single cycle of the jackpot — from first entry to draw and winner distribution |

---

*Document maintained by the BlackTree core team.*  
*Next milestone: Technical Architecture Document (v1.1)*
