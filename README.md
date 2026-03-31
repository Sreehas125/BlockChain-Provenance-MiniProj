# Research Data Provenance DApp

## Project Overview
A **Blockchain‑Based Research Data Provenance System** that records immutable provenance information for research datasets stored on IPFS. Each dataset version is stored on-chain with metadata (IPFS hash, owner, timestamp, and link to the previous version). The smart contract ensures only the dataset owner can create or update versions, providing verifiable lineage for academic publications.

## File Structure
```
research-provenance-dapp/
├─ frontend/                 # (Member 2) React UI – currently empty
└─ smart-contracts/
   ├─ contracts/
   │   └─ DataProvenance.sol      # Solidity contract
   ├─ test/
   │   └─ DataProvenance.test.js # Hardhat test suite
   ├─ scripts/
   │   └─ deploy.js               # Deployment script
   ├─ hardhat.config.js          # Hardhat configuration
   └─ package.json               # Node project metadata
```

## Team Roles & Tasks
- **Member 1 (Smart Contract Architect & Core Logic)** – Implemented:
  - `DataProvenance.sol` (structs, events, custom errors, owner‑only version updates)
  - Hardhat configuration & deployment script
  - Comprehensive Chai/Ethers test suite
- **Member 2 (Frontend & Integration)** – Pending:
  - React.js UI
  - IPFS/Pinata file‑storage integration
  - Web3 wallet connection via Ethers.js

## Development Commands
```bash
# From the smart‑contracts directory
cd smart-contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start a local Hardhat node (in a separate terminal)
npx hardhat node

# Deploy to the local network
npx hardhat run scripts/deploy.js --network localhost
```

These commands will compile the Solidity contract, execute the test suite, launch a local Ethereum‑compatible node, and finally deploy the `DataProvenance` contract.
