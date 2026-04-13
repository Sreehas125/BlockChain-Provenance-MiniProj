import React, { useState } from 'react';

function shortenAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ConnectWallet({ address, chainId, setProvider, setSigner, setAddress }) {
  const [errorMessage, setErrorMessage] = useState('');

  const connect = async () => {
    if (!window.ethereum) {
      setErrorMessage('MetaMask not detected. Install MetaMask and connect to the Hardhat local network.');
      return;
    }

    try {
      const [acct] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const ethersProvider = new (await import('ethers')).ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();
      setProvider(ethersProvider);
      setSigner(signer);
      setAddress(acct);
      setErrorMessage('');
    } catch (err) {
      console.error('Wallet connection failed', err);
      setErrorMessage(err?.shortMessage || 'Wallet connection failed. Please approve the MetaMask request.');
    }
  };

  return (
    <section className="wallet-card">
      <div>
        <p className="section-kicker">Wallet</p>
        <h2>{address ? 'Wallet connected' : 'Connect MetaMask'}</h2>
        <p className="muted-copy">
          Recommended local setup: RPC `http://127.0.0.1:8545`, Chain ID `31337`.
        </p>
      </div>

      <div className="wallet-actions">
        <button className="primary-button" onClick={connect}>
          {address ? 'Reconnect Wallet' : 'Connect Wallet'}
        </button>
        <div className="wallet-meta">
          <span><strong>Account:</strong> {address ? shortenAddress(address) : 'Not connected'}</span>
          <span><strong>Network:</strong> {chainId ? `Chain ID ${chainId}` : 'Unknown'}</span>
        </div>
      </div>

      {errorMessage && <p className="inline-error">{errorMessage}</p>}
    </section>
  );
}
