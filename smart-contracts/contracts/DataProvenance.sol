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
    event DatasetUpdated(uint256 indexed id, string newIpfsHash, uint256 timestamp);

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

    /// @dev Updates an existing dataset to a new version.
    function updateDataset(uint256 id, string calldata newIpfsHash, uint256 previousVersionId) external {
        Dataset storage ds = datasets[id];
        if (ds.id == 0) revert DatasetDoesNotExist(id);
        if (ds.owner != msg.sender) revert UnauthorizedAccess();
        if (previousVersionId != ds.id) revert InvalidVersionUpdate();
        ds.ipfsHash = newIpfsHash;
        ds.timestamp = block.timestamp;
        ds.previousVersionId = previousVersionId;
        emit DatasetUpdated(id, newIpfsHash, block.timestamp);
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
