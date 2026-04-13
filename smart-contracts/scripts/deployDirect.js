import { ethers } from "ethers";
import fs from "fs";
import path from "path";

async function main() {
  // Connect to local Hardhat node
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  // Hardhat default first private key (always the same)
  const privateKey = "0xac0974bec39a17e36ba4a6b8c2062cde8d423df6c8b0b5f8c5a4e18b3e64b9bd";
  const wallet = new ethers.Wallet(privateKey, provider);

  // Load ABI and bytecode from the compiled artifact
  const artifactPath = path.resolve("artifacts/contracts/DataProvenance.sol/DataProvenance.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  const contract = await factory.deploy();
  await contract.waitForDeployment();
  console.log("DataProvenance deployed to:", await contract.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
