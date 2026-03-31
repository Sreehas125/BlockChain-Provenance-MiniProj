# Product Requirements Document (PRD)
**Project Name:** Research Provenance DApp  
**Description:** A decentralized application designed to track the provenance, ownership, and version history of research datasets stored on IPFS.

---

## 1. Project Overview
In academic and scientific research, proving the origin and timeline of data is critical. The Research Provenance DApp leverages Ethereum smart contracts to create an immutable, transparent, and secure ledger of research datasets. By linking new dataset versions to their previous iterations, the DApp establishes a verifiable chain of custody (provenance) for all research data.

---

## 2. Team Roles & Responsibilities

### Member 1: Blockchain Architect & Backend Developer
**Responsibilities:** * Architect and write the core Solidity smart contracts.
* Set up the Web3 development environment and local blockchain node.
* Write comprehensive test suites to ensure contract security and logic validation.
* Optimize contract gas usage and handle deployment scripts.

### Member 2: Frontend Developer & Web3 Integrator
**Responsibilities:**
* Develop the user interface using React.
* Integrate Ethers.js to connect the frontend to the deployed smart contract.
* Implement user wallet connection (e.g., MetaMask).
* Build the forms and dashboards for users to interact with the blockchain data.

---

## 3. Current Progress Status
**Backend/Smart Contracts:** 🟢 100% Complete
**Frontend/UI:** 🔴 Pending Implementation

**Milestones Achieved:**
- [x] `DataProvenance.sol` smart contract written and optimized.
- [x] Modern Web3 development environment configured (Node 22, ESM, Hardhat 3).
- [x] Mocha/Chai testing suite written for all core functions and custom error reverts.
- [x] 100% pass rate on all smart contract tests.
- [x] Local deployment script (`deploy.js`) configured and ready for the frontend handoff.

---

## 4. Backend Implementation Details (Completed by Member 1)

The backend was implemented using **Solidity (v0.8.20)** and tested on a modern **Hardhat 3** environment using strict **ESM (ECMAScript Modules)** standards. 

### Core Smart Contract Logic (`DataProvenance.sol`)
* **Data Structure:** Utilizes a `Dataset` struct to store the `id`, `ipfsHash`, `owner`, `timestamp`, and `previousVersionId`.
* **State Management:** Uses mappings (`datasets` and `ownerDatasets`) to track global datasets and associate them with specific researcher addresses.
* **Gas Optimization:** Implemented Custom Errors (`UnauthorizedAccess`, `DatasetDoesNotExist`, `InvalidVersionUpdate`) instead of traditional `require` strings to heavily reduce gas costs during reverts.
* **Events:** Emits `DatasetRegistered` and `DatasetUpdated` events to allow the frontend to easily listen for and index state changes on the blockchain.

### Key Functions
1. `registerDataset(string ipfsHash)`: Mints a new dataset record and assigns the caller as the owner.
2. `updateDataset(uint256 id, string newIpfsHash, uint256 previousVersionId)`: Allows an owner to update a dataset, permanently linking the new IPFS hash to the older version's ID to establish provenance.
3. `getDataset(uint256 id)`: Read-only function to fetch a specific dataset's details.
4. `getDatasetsByOwner(address owner)`: Read-only function to fetch all dataset IDs owned by a specific researcher.

---

## 5. Pending Implementation (Tasks for Member 2)

Member 2 is responsible for building the React frontend and connecting it to the local Hardhat node. 

### Prerequisites for Member 2
1. Ask Member 1 to run `npx hardhat node` to start the local blockchain.
2. Ask Member 1 to run `npx hardhat run scripts/deploy.js --network localhost` and provide the **Deployed Contract Address**.
3. Obtain the **Contract ABI** from Member 1 (located in `artifacts/contracts/DataProvenance.sol/DataProvenance.json`).

### Action Items
- [ ] **Setup React App:** Initialize a new React application (Vite or Create React App).
- [ ] **Web3 Connection:** Install `ethers` and build a "Connect Wallet" button to link the user's MetaMask to the local Hardhat network (RPC URL: `http://127.0.0.1:8545`).
- [ ] **Contract Instance:** Initialize the Ethers.js contract instance using the ABI and Contract Address provided by Member 1.
- [ ] **UI - Register Dataset:** Build a form taking a string input (IPFS Hash) that calls the `registerDataset` function.
- [ ] **UI - Update Dataset:** Build a form taking three inputs (Dataset ID, New IPFS Hash, Previous Version ID) that calls the `updateDataset` function.
- [ ] **UI - Dashboard:** Build a view that calls `getDatasetsByOwner` to list all datasets owned by the connected wallet, displaying the IPFS hash, timestamp, and the provenance chain (showing the `previousVersionId`).