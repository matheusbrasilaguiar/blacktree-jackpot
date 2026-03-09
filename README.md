# BlackTree Jackpot 🌌🌳

**BlackTree** is a real-time, on-chain jackpot system built on the **Somnia Network**. It utilizes native push reactivity to provide a cinematic, zero-latency gaming experience without centralized polling, ensuring provably fair drawings using a Commit-Reveal PRNG architecture.

## 🚀 Getting Started

This repository is a monorepo divided into three main components: `contracts`, `backend` (NestJS), and `frontend` (Next.js). Follow the steps below in order to set up the development environment.

### 1. Prerequisites

- **Node.js** (v18 or higher)
- **NPM** or **Yarn**
- A web3 wallet (e.g., MetaMask) configured with the **Somnia Testnet**.
- Testnet STT (from the Somnia Faucet) for transaction gas fees.

---

### 2. Initial Setup

Install the required dependencies across all workspaces:

```bash
# From the project root
cd contracts && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

---

### 3. Smart Contracts (Optional)

The core jackpot logic is governed by `BlackTree.sol`. It enforces single-entry per round and utilizes a Commit-Reveal `blockhash` schema for 100% unbiased randomness.

1. Navigate to the contracts directory:

   ```bash
   cd contracts
   ```

2. Compile and Deploy:

   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.ts --network somnia
   ```

3. Copy the deployed contract address for the Backend and Frontend `.env` files.

---

### 4. Backend (NestJS + Prisma)

The Backend acts as the "Keeper" and "Indexer". It watches the blockchain to automatically close rounds and execute draws, while also indexing historic wins into a fast local SQLite database.

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a `.env` file based on your configuration:

   ```env
   NEXT_PUBLIC_JACKPOT_CONTRACT_ADDRESS=your_contract_address_here
   PRIVATE_KEY=your_funded_wallet_private_key_here
   ```

3. Initialize the database:

   ```bash
   npx prisma db push
   ```

4. Start the development server:

   ```bash
   npm run start:dev
   ```

*Note: The backend must remain running for the jackpot rounds to automatically conclude and distribute prizes.*

---

### 5. Frontend (Next.js)

The frontend provides the cinematic user interface, real-time balance tracking, and historical stats dashboard.

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_JACKPOT_CONTRACT_ADDRESS=your_contract_address_here
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000`.

---

## 🏗️ System Architecture

- **Smart Contracts:** V3 Commit-Reveal PRNG logic ensuring mathematical fairness and prize distribution.
- **Backend Keeper & Indexer:** NestJS autonomous service that orchestrates the 2-step `closeRound()` and `executeDraw()` state machine, and syncs historical data to SQLite.
- **Frontend Reactivity:** Next.js application utilizing WebSockets (Viem/Wagmi) to listen for live ticket purchases and wins with zero latency.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
