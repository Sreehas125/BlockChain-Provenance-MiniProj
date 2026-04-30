import React, { useState } from 'react';

export default function RegisterDataset({ contract, onSuccess }) {
  const [hash, setHash] = useState('');
  const [txHash, setTxHash] = useState('');
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
      const trimmedHash = hash.trim();
      if (!trimmedHash) {
        setErrorMessage('Enter a CID or dataset fingerprint before registering.');
        return;
      }

      const tx = await contract.registerDataset(trimmedHash);
      await tx.wait();
      setTxHash(tx.hash);
      setHash('');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.shortMessage || 'Registration failed. Please confirm the transaction in MetaMask.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel-card accent-card">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Step 1</p>
          <h2>Register Dataset</h2>
        </div>
        <span className="panel-badge">Create provenance record</span>
      </div>
      <p className="muted-copy">
        Enter an IPFS CID or any dataset fingerprint to timestamp ownership on-chain.
      </p>
      <form className="stack-form" onSubmit={submit}>
        <input
          className="text-input"
          type="text"
          placeholder="Enter IPFS CID or dataset hash"
          value={hash}
          onChange={e => setHash(e.target.value)}
          required
        />
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register Dataset'}
        </button>
      </form>
      {errorMessage && <p className="inline-error">{errorMessage}</p>}
      {txHash && (
        <div className="notice notice-success">
          <strong>Registered successfully.</strong> Transaction hash: <span className="mono">{txHash}</span>
        </div>
      )}
    </section>
  );
}
