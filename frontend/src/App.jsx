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

  // Load contract when signer and ABI are ready
  useEffect(() => {
    if (!signer) return;
    // ABI file should be placed at src/abi/DataProvenance.json
    import('./abi/DataProvenance.json')
      .then(module => {
        const abi = module.default?.abi || module.default; // Hardhat artifact structure
        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // user provides via .env
        const c = new ethers.Contract(contractAddress, abi, signer);
        setContract(c);
      })
      .catch(err => console.error('Failed to load ABI', err));
  }, [signer]);

  return (
    <Web3Context.Provider value={{ provider, signer, address, contract }}
    >
      <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>Research Provenance DApp</h1>
        <ConnectWallet setProvider={setProvider} setSigner={setSigner} setAddress={setAddress} />
        {address && (
          <div style={{ marginTop: '1rem' }}>
            <RegisterDataset contract={contract} />
            <UpdateDataset contract={contract} />
            <Dashboard contract={contract} address={address} />
          </div>
        )}
      </div>
    </Web3Context.Provider>
  );
}
