import React, { useState } from 'react';

export default function UpdateDataset({ contract }) {
  const [id, setId] = useState('');
  const [newHash, setNewHash] = useState('');
  const [prevId, setPrevId] = useState('');
  const [txHash, setTxHash] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!contract) {
      alert('Contract not loaded yet');
      return;
    }
    try {
      const tx = await contract.updateDataset(id, newHash, prevId);
      await tx.wait();
      setTxHash(tx.hash);
      setId(''); setNewHash(''); setPrevId('');
    } catch (err) {
      console.error(err);
      alert('Transaction failed');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}
    >
      <h3>Update Dataset</h3>
      <form onSubmit={submit}>
        <input
          type="number"
          placeholder="Dataset ID"
          value={id}
          onChange={e => setId(e.target.value)}
          required
          style={{ width: '30%', marginRight: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="New IPFS hash"
          value={newHash}
          onChange={e => setNewHash(e.target.value)}
          required
          style={{ width: '30%', marginRight: '0.5rem' }}
        />
        <input
          type="number"
          placeholder="Previous Version ID"
          value={prevId}
          onChange={e => setPrevId(e.target.value)}
          required
          style={{ width: '30%', marginRight: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.3rem 0.6rem' }}>Update</button>
      </form>
      {txHash && (
        <p>Last transaction hash: {txHash}</p>
      )}
    </div>
  );
}
