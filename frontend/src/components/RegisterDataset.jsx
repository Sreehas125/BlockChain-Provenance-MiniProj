import React, { useState } from 'react';

export default function RegisterDataset({ contract }) {
  const [hash, setHash] = useState('');
  const [txHash, setTxHash] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!contract) {
      alert('Contract not loaded yet');
      return;
    }
    try {
      const tx = await contract.registerDataset(hash);
      const receipt = await tx.wait();
      setTxHash(receipt.transactionHash);
      setHash('');
    } catch (err) {
      console.error(err);
      alert('Transaction failed');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h3>Register Dataset</h3>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="IPFS hash"
          value={hash}
          onChange={e => setHash(e.target.value)}
          required
          style={{ width: '60%', marginRight: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.3rem 0.6rem' }}>Register</button>
      </form>
      {txHash && (
        <p>Transaction submitted: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" >{txHash.slice(0, 10)}...</a></p>
      )}
    </div>
  );
}
