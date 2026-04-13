import React, { useState } from 'react';

export default function UpdateDataset({ contract, onSuccess }) {
  const [id, setId] = useState('');
  const [newHash, setNewHash] = useState('');
  const [prevId, setPrevId] = useState('');
  const [txHash, setTxHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!contract) {
      setErrorMessage('Contract not loaded yet. Check your wallet connection and deployed address.');
      return;
    }

    if (id !== prevId) {
      setErrorMessage('Previous Version ID must match the Dataset ID for this contract. For dataset 1, enter 1.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const tx = await contract.updateDataset(id, newHash, prevId);
      await tx.wait();
      setTxHash(tx.hash);
      setId('');
      setNewHash('');
      setPrevId('');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.shortMessage || 'Update failed. Make sure you are using your own dataset and set Previous Version ID equal to Dataset ID.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel-card">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Step 2</p>
          <h2>Update Dataset</h2>
        </div>
        <span className="panel-badge muted-badge">Record a new version</span>
      </div>
      <p className="muted-copy">Current contract rule: `Dataset ID` and `Previous Version ID` must be the same value.</p>
      <form className="three-column-form" onSubmit={submit}>
        <input
          className="text-input"
          type="number"
          placeholder="Dataset ID"
          value={id}
          onChange={e => {
            setId(e.target.value);
            setPrevId(e.target.value);
          }}
          required
        />
        <input
          className="text-input"
          type="text"
          placeholder="New IPFS hash"
          value={newHash}
          onChange={e => setNewHash(e.target.value)}
          required
        />
        <input
          className="text-input"
          type="number"
          placeholder="Previous Version ID"
          value={prevId}
          onChange={e => setPrevId(e.target.value)}
          required
        />
        <button className="secondary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Dataset'}
        </button>
      </form>
      {errorMessage && <p className="inline-error">{errorMessage}</p>}
      {txHash && (
        <div className="notice notice-success">
          <strong>Version updated.</strong> Transaction hash: <span className="mono">{txHash}</span>
        </div>
      )}
    </section>
  );
}
