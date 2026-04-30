# Frontend Setup

React frontend for the Research Data Provenance DApp.

## Run Locally
Start a Hardhat node and deploy the contract first:

```bash
cd ../smart-contracts
npx hardhat node
```

In another terminal:

```bash
cd ../smart-contracts
npx hardhat run scripts/deploy.js --network localhost
```

The deploy script updates:
- `frontend/.env`
- `frontend/src/abi/DataProvenance.json`

Then run the frontend:

```bash
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## MetaMask
Use the Hardhat local network:
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`

Import one of the default Hardhat accounts only for local testing. Never use those public keys on a live network.

## App Behavior
- Register Dataset creates an original provenance record.
- Update Dataset creates a new linked version.
- Empty CIDs are rejected.
- Same-CID updates are rejected because IPFS CIDs are content-addressed.
