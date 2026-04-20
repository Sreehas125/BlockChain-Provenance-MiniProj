import { expect } from "chai";
import hre from "hardhat";

describe("DataProvenance", function () {
  
  // Fixture to deploy the contract once and reuse it in tests
  async function deployDataProvenanceFixture() {
    
    // The config is fixed, so hre.ethers is officially loaded now!
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const DataProvenance = await hre.ethers.getContractFactory("DataProvenance");
    const dataProvenance = await DataProvenance.deploy();
    
    return { dataProvenance, owner, otherAccount };
  }

  describe("Dataset Registration", function () {
    it("Should register a new dataset and assign ID 1", async function () {
      const { dataProvenance, owner } = await deployDataProvenanceFixture();
      const ipfsHash = "QmTestHash123";

      // Register the dataset
      await dataProvenance.registerDataset(ipfsHash);

      // Verify state changes using the getDataset function
      const dataset = await dataProvenance.getDataset(1n);
      expect(dataset.ipfsHash).to.equal(ipfsHash);
      expect(dataset.owner).to.equal(owner.address);
      expect(dataset.previousVersionId).to.equal(0n);
    });
  });

  describe("Dataset Updates (Provenance Tracking)", function () {
    it("Should allow owner to create a new linked version", async function () {
      const { dataProvenance, owner } = await deployDataProvenanceFixture();
      const hashV1 = "QmTestHashV1";
      const hashV2 = "QmTestHashV2";

      // Register initial version
      await dataProvenance.registerDataset(hashV1);

      // Create a new version linked to version 1
      await dataProvenance.updateDataset(1n, hashV2, 1n);

      // Verify the original version is preserved
      const datasetV1 = await dataProvenance.getDataset(1n);
      expect(datasetV1.ipfsHash).to.equal(hashV1);
      expect(datasetV1.previousVersionId).to.equal(0n);

      // Verify the new version is stored as a separate record
      const datasetV2 = await dataProvenance.getDataset(2n);
      expect(datasetV2.ipfsHash).to.equal(hashV2);
      expect(datasetV2.owner).to.equal(owner.address);
      expect(datasetV2.previousVersionId).to.equal(1n);

      const ownerDatasetIds = await dataProvenance.getDatasetsByOwner(owner.address);
      expect(ownerDatasetIds).to.deep.equal([1n, 2n]);
    });

    it("Should revert with custom error if a non-owner tries to update", async function () {
      const { dataProvenance, otherAccount } = await deployDataProvenanceFixture();
      
      // Original owner registers the dataset
      await dataProvenance.registerDataset("QmTestHashV1");

      // Connect as 'otherAccount' and try to hijack 'owner's dataset (ID 1)
      await expect(
        dataProvenance.connect(otherAccount).updateDataset(1n, "QmHackedHash", 1n)
      ).to.be.revertedWithCustomError(dataProvenance, "UnauthorizedAccess");
    });

    it("Should revert if trying to update a dataset that does not exist", async function () {
      const { dataProvenance } = await deployDataProvenanceFixture();
      
      // Try to update ID 99 which hasn't been created
      await expect(
        dataProvenance.updateDataset(99n, "QmHash", 0n)
      ).to.be.revertedWithCustomError(dataProvenance, "DatasetDoesNotExist")
       .withArgs(99n);
    });

    it("Should revert if previous version ID does not match the dataset being extended", async function () {
      const { dataProvenance } = await deployDataProvenanceFixture();

      await dataProvenance.registerDataset("QmTestHashV1");

      await expect(
        dataProvenance.updateDataset(1n, "QmTestHashV2", 7n)
      ).to.be.revertedWithCustomError(dataProvenance, "InvalidVersionUpdate");
    });
  });
});
