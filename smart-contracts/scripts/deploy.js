import { ethers } from "hardhat";

async function main() {
  const DataProvenance = await ethers.getContractFactory("DataProvenance");
  const dataProvenance = await DataProvenance.deploy();
  await dataProvenance.waitForDeployment();
  console.log("DataProvenance deployed to:", await dataProvenance.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
