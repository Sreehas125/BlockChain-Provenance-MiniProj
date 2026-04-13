import { ethers } from 'ethers';

(async () => {
  const abiData = await import('../artifacts/contracts/DataProvenance.sol/DataProvenance.json');
  const abi = abiData.default.abi;
  const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
  const contract = new ethers.Contract(address, abi, wallet);
  const tx = await contract.registerDataset('QmetkaJYFQghjbRa5xQJ4D7u1Lufyy8sPKqhVrBYPpVzjS');
  const receipt = await tx.wait();
  console.log('Tx hash:', receipt.transactionHash);
})();