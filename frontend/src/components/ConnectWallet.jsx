import React from 'react';

export default function ConnectWallet({ setProvider, setSigner, setAddress }) {
  const connect = async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected. Please install it.');
      return;
    }
    try {
      const [acct] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const ethersProvider = new (await import('ethers')).ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();
      setProvider(ethersProvider);
      setSigner(signer);
      setAddress(acct);
    } catch (err) {
      console.error('Wallet connection failed', err);
    }
  };

  return (
    <button onClick={connect} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
      Connect Wallet
    </button>
  );
}
