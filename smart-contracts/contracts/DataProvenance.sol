// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Data Provenance Contract
/// @notice Tracks research dataset provenance stored on IPFS.
contract DataProvenance {
    // Custom errors for gas‑efficient reverts
    error UnauthorizedAccess();
    error DatasetDoesNotExist(uint256 id);
    error InvalidVersionUpdate();

    struct Dataset {
        uint256 id;
        string ipfsHash;
        address owner;
        uint256 timestamp;
        uint256 previousVersionId; // 0 if first version
    }

    // Mapping from dataset ID to its data
    mapping(uint256 => Dataset) private datasets;
    // Mapping from owner address to list of owned dataset IDs
    mapping(address => uint256[]) private ownerDatasets;

    // Incremental ID counter
    uint256 private nextId = 1;

    // Events
    event DatasetRegistered(uint256 indexed id, string ipfsHash, address indexed owner, uint256 timestamp, uint256 previousVersionId);
    event DatasetUpdated(
        uint256 indexed id,
        string newIpfsHash,
        address indexed owner,
        uint256 timestamp,
        uint256 previousVersionId
    );

    /// @dev Registers a new dataset.
    function registerDataset(string calldata ipfsHash) external returns (uint256) {
        uint256 currentId = nextId++;
        Dataset memory ds = Dataset({
            id: currentId,
            ipfsHash: ipfsHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            previousVersionId: 0
        });
        datasets[currentId] = ds;
        ownerDatasets[msg.sender].push(currentId);
        emit DatasetRegistered(currentId, ipfsHash, msg.sender, block.timestamp, 0);
        return currentId;
    }

    /// @dev Creates a new dataset version linked to an existing one.
    function updateDataset(uint256 id, string calldata newIpfsHash, uint256 previousVersionId) external returns (uint256) {
        Dataset memory previousDataset = datasets[id];
        if (previousDataset.id == 0) revert DatasetDoesNotExist(id);
        if (previousDataset.owner != msg.sender) revert UnauthorizedAccess();
        if (previousVersionId != previousDataset.id) revert InvalidVersionUpdate();

        uint256 currentId = nextId++;
        Dataset memory ds = Dataset({
            id: currentId,
            ipfsHash: newIpfsHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            previousVersionId: previousVersionId
        });

        datasets[currentId] = ds;
        ownerDatasets[msg.sender].push(currentId);

        emit DatasetUpdated(currentId, newIpfsHash, msg.sender, block.timestamp, previousVersionId);
        return currentId;
    }

    /// @notice Retrieves dataset information.
    function getDataset(uint256 id) external view returns (Dataset memory) {
        Dataset memory ds = datasets[id];
        if (ds.id == 0) revert DatasetDoesNotExist(id);
        return ds;
    }

    /// @notice Returns list of dataset IDs owned by an address.
    function getDatasetsByOwner(address owner) external view returns (uint256[] memory) {
        return ownerDatasets[owner];
    }
}
