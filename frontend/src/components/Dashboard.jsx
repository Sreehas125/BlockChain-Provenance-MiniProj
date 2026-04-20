import React, { useState, useEffect } from 'react';

export default function Dashboard({ contract, address, refreshKey }) {
  const [datasets, setDatasets] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDatasets = async () => {
    if (!contract) return;

    try {
      setErrorMessage('');
      const ids = await contract.getDatasetsByOwner(address);
      const dataPromises = ids.map(id => contract.getDataset(id));
      const results = await Promise.all(dataPromises);
      const formatted = results.map(d => ({
        id: d.id.toString(),
        ipfsHash: d.ipfsHash,
        isRootVersion: d.previousVersionId === 0n,
        timestamp: new Date(Number(d.timestamp) * 1000).toLocaleString(),
        previousVersionId: d.previousVersionId.toString()
      })).sort((a, b) => Number(a.id) - Number(b.id));
      setDatasets(formatted);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.shortMessage || 'Could not load datasets from the contract.');
    }
  };

  useEffect(() => {
    loadDatasets();
  }, [contract, address, refreshKey]);

  return (
    <section className="panel-card dashboard-card">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Dashboard</p>
          <h2>Your Datasets</h2>
        </div>
        <button className="ghost-button" type="button" onClick={loadDatasets}>
          Refresh
        </button>
      </div>

      <div className="summary-strip">
        <div className="summary-item">
          <span className="summary-label">Datasets tracked</span>
          <strong>{datasets.length}</strong>
        </div>
        <div className="summary-item">
          <span className="summary-label">Researcher</span>
          <strong className="mono">{address}</strong>
        </div>
      </div>

      {errorMessage && <p className="inline-error">{errorMessage}</p>}

      {datasets.length === 0 ? (
        <div className="empty-state">
          <h3>No datasets found yet</h3>
          <p>Register your first dataset to start building an auditable provenance trail.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="dataset-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>IPFS Hash</th>
                <th>Timestamp</th>
                <th>Version Type</th>
                <th>Prev Version</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map(ds => (
                <tr key={ds.id}>
                  <td>{ds.id}</td>
                  <td>
                    <a href={`https://ipfs.io/ipfs/${ds.ipfsHash}`} target="_blank" rel="noreferrer">
                      {ds.ipfsHash.slice(0, 18)}...
                    </a>
                  </td>
                  <td>{ds.timestamp}</td>
                  <td>{ds.isRootVersion ? 'Original' : 'Derived Version'}</td>
                  <td>{ds.previousVersionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
