// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IBlackTree {
    function executeDraw(address first, address second, address third) external;
    function getParticipants() external view returns (address[] memory);
}

// Mock interface for the Hackathon representing SomniaEventHandler
interface SomniaEventHandler {
    function onEvent(bytes calldata data) external;
}

contract JackpotHandler is SomniaEventHandler {
    address public owner;
    IBlackTree public blackTree;

    error NotAuthorized();
    error NotEnoughParticipants();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAuthorized();
        _;
    }

    constructor(address _blackTreeAddress) {
        owner = msg.sender;
        blackTree = IBlackTree(_blackTreeAddress);
    }

    function setBlackTree(address _blackTreeAddress) external onlyOwner {
        blackTree = IBlackTree(_blackTreeAddress);
    }

    // In a real Somnia Reactivity environment, this is called by the system Validator
    // For local tests/hackathon, it represents the entry point triggered by `Schedule`
    function onEvent(bytes calldata /* data */) external override {
        address[] memory participants = blackTree.getParticipants();
        
        if (participants.length < 2) {
            // Rollover for 1 participant, wait for more players
            return;
        }

        (address first, address second, address third) = _drawWinners(participants);
        
        blackTree.executeDraw(first, second, third);
        
        _scheduleNext();
    }

    function _drawWinners(address[] memory participants) internal view returns (address first, address second, address third) {
        uint256 length = participants.length;
        
        // Pseudo-randomness using prevrandao for MVP
        uint256 seed = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, length)));
        
        uint256 idx1 = seed % length;
        first = participants[idx1];
        
        uint256 idx2;
        if (length > 1) {
            uint256 seed2 = uint256(keccak256(abi.encodePacked(seed, uint256(1))));
            idx2 = seed2 % length;
            if (idx1 == idx2) idx2 = (idx2 + 1) % length;
            second = participants[idx2];
        }

        if (length > 2) {
            uint256 seed3 = uint256(keccak256(abi.encodePacked(seed, uint256(2))));
            uint256 idx3 = seed3 % length;
            while (idx3 == idx1 || idx3 == idx2) {
                idx3 = (idx3 + 1) % length;
            }
            third = participants[idx3];
        }
        
        return (first, second, third);
    }

    function _scheduleNext() internal {
        // In the full Somnia Node Reactivity integration, this is where the contract
        // emits a specific event or calls a System Precompile to schedule the next execution.
    }
}
