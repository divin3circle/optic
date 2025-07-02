# Optic - On‑Chain Bitcoin DeFi Hub for ICP

A fully on‑chain Bitcoin‑DeFi protocol for the ICP Hackathon (DeFi & Bitcoin track), built end‑to‑end in TypeScript with [Azle](https://demergent-labs.github.io/azle/) canisters and a React/React Native frontend.

**Optic** lets users bridge BTC → ckBTC, earn optimized yields, borrow ICP‑assets, and govern via staked ckBTC. All logic is on‑chain, with a modern, wallet‑connected frontend.

---

## 🚀 Features

### 🔗 Trustless BTC Bridging (DFINITY ckBTC Bridge)

- **Per-user Bitcoin deposit addresses** via the `BridgeHandler` canister.
- **Automatic minting of ckBTC**: Users send BTC, bridge mints ckBTC to their principal using the [DFINITY ckBTC bridge](https://internetcomputer.org/docs/current/developer-docs/integrations/bitcoin/ckbtc/).

### 📈 Yield Aggregation & Auto‑Rebalancing (ICPSwap Integration)

- **Oracle canister** fetches real-time APRs for each registered pool, including [ICPSwap](https://icpswap.com/) pools.
- **Pool Registry** tracks all available pools (ICPSwap and custom).
- **YieldRouter** deposits ckBTC into the highest-APR vault/pool, records user positions.
- **Auto-rebalancing**: Hourly timer triggers `checkAndRebalance()`, migrating funds if a better APR is found.

### 🗳️ Governance via ckBTC Staking

- **Stake ckBTC** in the `Governance` canister for voting power.
- **Create/vote/tally proposals** to change protocol parameters (rebalance threshold, fees, quorum, etc.).
- **On-pass proposal callbacks** update YieldRouter or Pool Registry.

### 🧩 Modular On‑Chain Data Models (Azle + StableBTreeMap)

- **BridgeHandler**: `deposits: Map<string, Principal>`
- **YieldRouter**: `positions: Map<Principal, Position[]>`
- **Oracle**: `feeds: Map<PoolId, OracleFeed>`
- **Governance**: `staked: Map<Principal, Nat>`, `proposals: Map<ProposalId, Proposal>`, `votes: Map<ProposalId, Map<Principal, Bool>>`
- **Pool Registry**: `pools: Map<PoolId, Pool>`
- **Portfolio**: `balancesCache: Map<Principal, Balances>`

### 🖥️ Frontend Flows (React)

- **Connect Wallet**: Plug / Stoic, fetch balances via Portfolio canister.
- **Bridge BTC**: Show QR/bitcoin: deep-link, poll for ckBTC balance.
- **Deposit ckBTC**: Call `YieldRouter.deposit()`, UI shows active positions.
- **Auto-Rebalance**: UI updates via events/polling, toasts for rebalances.
- **Governance**: Stake, propose, vote, view status, trigger protocol changes.
- **Withdraw**: `YieldRouter.withdraw()`, optional burn + bridge-back to BTC.

### 🤖 (Optional) InfoAgent Canister

- On-chain LLM answers queries like "What's my APR?" by pulling live data from Oracle, Portfolio, and Governance.

---

## 🏗️ Architecture

```js
// Coming soon
```

---

## 📦 Data Models

```ts
type Position = {
  poolId: string;
  amount: bigint; // in smallest ckBTC units
  aprAtDeposit: number; // percentage
  timestamp: bigint; // Unix time
  lastRebalance: bigint; // Unix time
};

type OracleFeed = {
  poolId: string;
  apr: number;
  updatedAt: bigint;
};

type Pool = {
  id: string;
  name: string;
  canisterId: Principal;
  enabled: boolean;
};

type ProposalParams = {
  rebalanceThreshold: number; // APR diff %
  feeRateBps: number; // basis points
  minStake: bigint; // smallest units
  votingPeriodSec: bigint;
  quorumBps: bigint;
};

type Proposal = {
  id: string;
  proposer: Principal;
  params: ProposalParams;
  status: "Open" | "Passed" | "Failed";
  votes: Map<Principal, boolean>;
};

type Balances = {
  ckBTC: number;
  BTC: number;
  ICP: number;
  updatedAt: bigint;
};
```

---

## ⚙️ Canister Overview

| Canister          | Key Methods                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| **BridgeHandler** | `createDepositAddress(principal)`, `updateMint(btcAddress, amountE8)`                                                |
| **Oracle**        | `updateFeed(poolId, apr)`, `getFeeds()`                                                                              |
| **YieldRouter**   | `deposit(principal, amount)`, `withdraw(principal, amount)`, `checkAndRebalance()`                                   |
| **Portfolio**     | `getBalances(principal)`, `getPositions(principal)`                                                                  |
| **Governance**    | `stakeCkBTC(principal, amount)`, `unstakeCkBTC(principal, amount)`, `createProposal(...)`, `vote(...)`, `tally(...)` |
| **Pool Registry** | `addPool(pool)`, `removePool(id)`, `togglePool(id, enabled)`                                                         |
| **InfoAgent**     | `query(principal, prompt)`                                                                                           |

---

## 🏦 ICPSwap & Pool Registry Integration

- The **Pool Registry** canister tracks all available pools, including those on [ICPSwap](https://icpswap.com/).
- The **Oracle** canister fetches APRs from ICPSwap and other sources.
- The **YieldRouter** canister routes user deposits to the highest-yielding pool, including ICPSwap pools, and records positions.
- This enables seamless, on-chain yield optimization across the ICP DeFi ecosystem.

---

## 🪙 DFINITY ckBTC Bridge Integration

- The **BridgeHandler** canister issues per-user Bitcoin deposit addresses.
- When a user sends BTC to their address, the canister tracks the deposit and triggers ckBTC minting via the [DFINITY ckBTC bridge](https://internetcomputer.org/docs/current/developer-docs/integrations/bitcoin/ckbtc/).
- Users receive ckBTC directly to their principal, which can then be used in DeFi flows.

---

## 🛠 Getting Started (Local Dev/Test)

1. **Install Dependencies**

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. **Configure `dfx.json`**

   - Add canister entries for each actor with their Azle builds.
   - Enable Bitcoin integration:
     ```json
     "defaults": {
       "bitcoin": {
         "enabled": true,
         "nodes": ["127.0.0.1:18444"]
       }
     }
     ```

3. **Run Bitcoin Regtest Node**

   ```bash
   bitcoind -conf=$(pwd)/bitcoin_data/bitcoin.conf -datadir=$(pwd)/bitcoin_data --port=18444
   ```

4. **Run Local Testnet**

   ```bash
   dfx start --background --enable-bitcoin --bitcoin-node 127.0.0.1:18444
   dfx deploy --network=local
   ```

5. **Start Frontend**

   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Bridge BTC on Regtest**
   - Use a Bitcoin regtest wallet to send BTC to your deposit address.
   - Confirm ckBTC balance appears in the dashboard.

---

## 🧑‍💻 Tech Stack

- **Backend:** [Azle (TypeScript)](https://demergent-labs.github.io/azle/) canisters on ICP
- **Frontend:** React (Web & Mobile)
- **Bridge & Oracle:** [DFINITY ckBTC bridge](https://internetcomputer.org/docs/current/developer-docs/integrations/bitcoin/ckbtc/), custom HTTP outcalls, or ChainFusion oracles
- **Pool Data:** [ICPSwap](https://icpswap.com/)

---

## 📚 References & Documentation

- [Azle Docs](https://demergent-labs.github.io/azle/)
- [DFINITY Bitcoin & ckBTC Integration](https://internetcomputer.org/docs/current/developer-docs/integrations/bitcoin/ckbtc/)
- [ICPSwap](https://icpswap.com/)
- [ICP Bitcoin Developer Docs](https://internetcomputer.org/docs/build-on-btc/)

---

## 🚢 Deployment

- **Mainnet:**
  ```bash
  dfx deploy --network=ic
  ```
- **CI/CD:**  
  GitHub Actions builds Azle canisters, runs tests, and deploys to `--network=local` or `--network=ic`.

---

## 🗺️ Roadmap

- Add lending engine for ICP‑asset borrowing against ckBTC collateral
- Integrate real‑world BTC DeFi platforms via bridge outcalls
- Launch mobile companion app in React Native
- Expand InfoAgent with richer on‑chain analytics

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/XYZ`
3. Commit your changes: `git commit -am 'Add XYZ'`
4. Push to branch: `git push origin feature/XYZ`
5. Open a Pull Request

---

## 📄 License

MIT © Your Team Name

```

```
