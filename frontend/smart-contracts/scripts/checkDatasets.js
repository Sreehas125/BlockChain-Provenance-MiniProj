const { ethers } = require('ethers');
(async () => {
  const abi = (await import('../artifacts/contracts/DataProvenance.sol/DataProvenance.json')).default.abi;
  const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  const contract = new ethers.Contract(address, abi, provider);
  const owner = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const ids = await contract.getDatasetsByOwner(owner);
  console.log('Owned IDs:', ids.map(id => id.toString()));
})();
