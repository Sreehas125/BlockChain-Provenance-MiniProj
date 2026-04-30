import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function shortenAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ConnectWallet({ address, chainId, setProvider, setSigner, setAddress }) {
  const [errorMessage, setErrorMessage] = useState('');

  const syncWallet = async (requestAccounts = false) => {
    if (!window.ethereum) {
      setErrorMessage('MetaMask not detected. Install MetaMask and connect to the Hardhat local network.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: requestAccounts ? 'eth_requestAccounts' : 'eth_accounts'
      });
      const [acct] = accounts;
      if (!acct) {
        setProvider(null);
        setSigner(null);
        setAddress('');
        return;
      }

      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
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

  const connect = () => syncWallet(true);

  useEffect(() => {
    if (!window.ethereum?.on) return undefined;

    const handleAccountsChanged = () => {
      syncWallet(false);
    };

    const handleChainChanged = () => {
      syncWallet(false);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener?.('chainChanged', handleChainChanged);
    };
  }, []);

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
