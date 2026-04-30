import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';
import ConnectWallet from './components/ConnectWallet.jsx';
import RegisterDataset from './components/RegisterDataset.jsx';
import UpdateDataset from './components/UpdateDataset.jsx';
import Dashboard from './components/Dashboard.jsx';
import DataProvenanceArtifact from './abi/DataProvenance.json';

export const Web3Context = createContext(null);

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [contractError, setContractError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [chainId, setChainId] = useState('');

  const refreshDatasets = () => {
    setRefreshKey(current => current + 1);
  };

  useEffect(() => {
    if (!provider) {
      setChainId('');
      return;
    }

    let active = true;

    provider.getNetwork()
      .then(network => {
        if (active) {
          setChainId(network.chainId.toString());
        }
      })
      .catch(err => {
        console.error('Failed to load network', err);
      });

    return () => {
      active = false;
    };
  }, [provider]);

  useEffect(() => {
    if (!signer) {
      setContract(null);
      setContractError('');
      return;
    }

    let active = true;

    async function loadContract() {
      try {
        const abi = DataProvenanceArtifact.abi || DataProvenanceArtifact;
        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
        if (!contractAddress || !ethers.isAddress(contractAddress)) {
          if (active) {
            setContract(null);
            setContractError('Set a valid VITE_CONTRACT_ADDRESS in frontend/.env after deploying the contract.');
          }
          return;
        }

        const code = await signer.provider.getCode(contractAddress);
        if (code === '0x') {
          if (active) {
            setContract(null);
            setContractError(`No contract is deployed at ${contractAddress} on the connected network.`);
          }
          return;
        }

        const nextContract = new ethers.Contract(contractAddress, abi, signer);
        if (active) {
          setContract(nextContract);
          setContractError('');
        }
      } catch (err) {
        console.error('Failed to load ABI', err);
        if (active) {
          setContract(null);
          setContractError('Failed to load the deployed contract. Re-run the deploy script and reconnect MetaMask.');
        }
      }
    }

    loadContract();

    return () => {
      active = false;
    };
  }, [signer]);

  return (
    <Web3Context.Provider value={{ provider, signer, address, contract }}>
      <div className="app-shell">
        <div className="app-backdrop" />
        <main className="app-container">
          <section className="hero-card">
            <div>
              <p className="eyebrow">Blockchain Research Integrity</p>
              <h1>Research Provenance DApp</h1>
              <p className="hero-copy">
                Register dataset fingerprints, preserve authorship, and track version changes on a local blockchain.
              </p>
            </div>
            <div className="hero-aside">
              <div className="stat-card">
                <span className="stat-label">Connected Network</span>
                <strong>{chainId ? `Chain ID ${chainId}` : 'Not connected'}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Contract</span>
                <strong className="mono">
                  {import.meta.env.VITE_CONTRACT_ADDRESS || 'Missing address'}
                </strong>
              </div>
            </div>
          </section>

          <ConnectWallet
            address={address}
            chainId={chainId}
            setProvider={setProvider}
            setSigner={setSigner}
            setAddress={setAddress}
          />

          {contractError && (
            <div className="notice notice-error">
              <strong>Contract setup issue.</strong> {contractError}
            </div>
          )}

          {address ? (
            <div className="content-grid">
              <div className="panel-stack">
                <RegisterDataset contract={contract} onSuccess={refreshDatasets} />
                <UpdateDataset contract={contract} onSuccess={refreshDatasets} />
              </div>
              <Dashboard contract={contract} address={address} refreshKey={refreshKey} />
            </div>
          ) : (
            <section className="empty-card">
              <h2>Connect your wallet to begin</h2>
              <p>
                Use the Hardhat local account in MetaMask, then register or update dataset versions and inspect their on-chain history.
              </p>
            </section>
          )}
        </main>
      </div>
    </Web3Context.Provider>
  );
}
