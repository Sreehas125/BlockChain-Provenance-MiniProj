import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';
import ConnectWallet from './components/ConnectWallet.jsx';
import RegisterDataset from './components/RegisterDataset.jsx';
import UpdateDataset from './components/UpdateDataset.jsx';
import Dashboard from './components/Dashboard.jsx';

export const Web3Context = createContext(null);

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [contractError, setContractError] = useState('');

  // Load contract when signer and ABI are ready
  useEffect(() => {
    if (!signer) {
      setContract(null);
      setContractError('');
      return;
    }

    // ABI file should be placed at src/abi/DataProvenance.json
    import('./abi/DataProvenance.json')
      .then(module => {
        const abi = module.default?.abi || module.default; // Hardhat artifact structure
        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // user provides via .env
        if (!contractAddress || !ethers.isAddress(contractAddress)) {
          setContract(null);
          setContractError('Set a valid VITE_CONTRACT_ADDRESS in frontend/.env after deploying the contract.');
          return;
        }
        const c = new ethers.Contract(contractAddress, abi, signer);
        setContract(c);
        setContractError('');
      })
      .catch(err => {
        console.error('Failed to load ABI', err);
        setContract(null);
        setContractError('Failed to load the contract ABI from frontend/src/abi/DataProvenance.json.');
      });
  }, [signer]);

  return (
    <Web3Context.Provider value={{ provider, signer, address, contract }}
    >
      <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>Research Provenance DApp</h1>
        <ConnectWallet setProvider={setProvider} setSigner={setSigner} setAddress={setAddress} />
        {address && (
          <div style={{ marginTop: '1rem' }}>
            {contractError && (
              <p style={{ color: '#b42318', marginBottom: '1rem' }}>{contractError}</p>
            )}
            <RegisterDataset contract={contract} />
            <UpdateDataset contract={contract} />
            <Dashboard contract={contract} address={address} />
          </div>
        )}
      </div>
    </Web3Context.Provider>
  );
}
