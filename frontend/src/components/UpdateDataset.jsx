import React, { useState } from 'react';

export default function UpdateDataset({ contract, onSuccess }) {
  const [id, setId] = useState('');
  const [newHash, setNewHash] = useState('');
  const [txHash, setTxHash] = useState('');
  const [createdVersionId, setCreatedVersionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!contract) {
      setErrorMessage('Contract not loaded yet. Check your wallet connection and deployed address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const versionId = BigInt(id);
      const trimmedHash = newHash.trim();
      if (!trimmedHash) {
        setErrorMessage('Enter a new CID before updating this dataset.');
        return;
      }

      const currentDataset = await contract.getDataset(versionId);

      if (currentDataset.ipfsHash === trimmedHash) {
        setErrorMessage('No change detected. The new CID matches the existing dataset CID.');
        return;
      }

      const tx = await contract.updateDataset(versionId, trimmedHash, versionId);
      const receipt = await tx.wait();
      const updateEvent = receipt.logs
        .map(log => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find(parsedLog => parsedLog?.name === 'DatasetUpdated');

      setTxHash(tx.hash);
      setCreatedVersionId(updateEvent ? updateEvent.args.id.toString() : '');
      setId('');
      setNewHash('');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.shortMessage || 'Update failed. Make sure you are extending one of your own dataset versions.');
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
      <p className="muted-copy">Create a fresh on-chain version by linking it to the dataset version you are extending.</p>
      <form className="two-column-form" onSubmit={submit}>
        <input
          className="text-input"
          type="number"
          min="1"
          placeholder="Version ID to extend"
          value={id}
          onChange={e => setId(e.target.value)}
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
        <button className="secondary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Dataset'}
        </button>
      </form>
      {errorMessage && <p className="inline-error">{errorMessage}</p>}
      {txHash && (
        <div className="notice notice-success">
          <strong>Version created.</strong> New dataset ID: <span className="mono">{createdVersionId || 'Loaded from event'}</span>. Transaction hash: <span className="mono">{txHash}</span>
        </div>
      )}
    </section>
  );
}
