# Front‑end (React) Setup for Research Provenance DApp

## Prerequisites
- **Node.js** (v22 or later recommended)
- **MetaMask** (or any injected Web3 wallet) installed in your browser
- The **smart‑contract** must be compiled, deployed on a local Hardhat node, and you must have:
  1. The **contract address** (from the deploy script output)
  2. The **ABI JSON** file (`DataProvenance.json`) produced under `smart-contracts/artifacts/contracts/DataProvenance.sol/`

## Quick start
```bash
# 1️⃣ Clone / navigate to the repo root (already there)
cd F:/Projects/BlockChain-Provenance-MiniProj

# 2️⃣ Install front‑end dependencies
cd frontend
npm install
```

## Prepare the UI artefacts
1. **Copy the ABI**
   ```bash
   # From the smart‑contract folder (run this in a separate terminal)
   cp smart-contracts/artifacts/contracts/DataProvenance.sol/DataProvenance.json frontend/src/abi/DataProvenance.json
   ```
2. **Set the contract address**
   Edit `frontend/.env` (created automatically) and replace the placeholder with the address printed by the deploy script:
   ```
   VITE_CONTRACT_ADDRESS=0xabc123...   # <-- put your address here
   ```
   Vite exposes variables prefixed with `VITE_` to the code.

## Run a local blockchain (in a separate terminal)
```bash
cd smart-contracts
npx hardhat node   # starts an in‑memory Ethereum node on localhost:8545
```

## Deploy the contract (still in the `smart-contracts` terminal)
```bash
npx hardhat run scripts/deploy.js --network localhost
# copy the printed address into the .env file above
```

## Start the React development server
```bash
cd frontend
npm run dev
```
The app will be available at `http://localhost:5173`. Open it, click **Connect Wallet**, approve in MetaMask, and you can:
- Register a new dataset (enter an IPFS CID)
- Update an existing dataset (provide ID, new CID, previous version ID)
- View all your datasets in the dashboard.

## Notes on the interaction choice
- The **React UI** offers a user‑friendly, browser‑based experience that abstracts away raw transaction details. This is ideal for a research‑oriented DApp where non‑technical users need to interact with provenance data easily.
- If you ever prefer a **pure CLI / script‑only** workflow, you can interact directly with the contract via `ethers` or `web3.js` scripts—just use the same ABI and address. The UI is optional, but it dramatically lowers the barrier for adoption.

---
*All front‑end code lives under `frontend/`. Feel free to customize styling or extend functionality (e.g., IPFS upload integration).*
