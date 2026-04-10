import React, { useState, useEffect } from 'react';

export default function Dashboard({ contract, address }) {
  const [datasets, setDatasets] = useState([]);

  const loadDatasets = async () => {
    if (!contract) return;
    try {
      const ids = await contract.getDatasetsByOwner(address);
      const dataPromises = ids.map(id => contract.getDataset(id));
      const results = await Promise.all(dataPromises);
      const formatted = results.map(d => ({
        id: d.id.toString(),
        ipfsHash: d.ipfsHash,
        timestamp: new Date(d.timestamp.toNumber() * 1000).toLocaleString(),
        previousVersionId: d.previousVersionId.toString()
      }));
      setDatasets(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDatasets();
    // Re‑load when contract changes
  }, [contract, address]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem' }}
    >
      <h3>Your Datasets</h3>
      {datasets.length === 0 ? (
        <p>No datasets found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '4px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '4px' }}>IPFS Hash</th>
              <th style={{ border: '1px solid #ddd', padding: '4px' }}>Timestamp</th>
              <th style={{ border: '1px solid #ddd', padding: '4px' }}>Prev Version</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map(ds => (
              <tr key={ds.id}>
                <td style={{ border: '1px solid #ddd', padding: '4px' }}>{ds.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '4px' }}><a href={`https://ipfs.io/ipfs/${ds.ipfsHash}`} target="_blank" rel="noreferrer">{ds.ipfsHash.slice(0, 12)}...</a></td>
                <td style={{ border: '1px solid #ddd', padding: '4px' }}>{ds.timestamp}</td>
                <td style={{ border: '1px solid #ddd', padding: '4px' }}>{ds.previousVersionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
