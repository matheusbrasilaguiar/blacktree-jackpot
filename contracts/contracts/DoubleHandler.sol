// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IBlackTreeDouble {
    function executeDraw(uint8 number, uint8 winningColor, uint256 multiplier) external;
}

interface SomniaEventHandler {
    function onEvent(bytes calldata data) external;
}

contract DoubleHandler is SomniaEventHandler {
    address public owner;
    IBlackTreeDouble public blackTreeDouble;

    error NotAuthorized();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAuthorized();
        _;
    }

    constructor(address _blackTreeDoubleAddress) {
        owner = msg.sender;
        blackTreeDouble = IBlackTreeDouble(_blackTreeDoubleAddress);
    }

    function setBlackTreeDouble(address _address) external onlyOwner {
        blackTreeDouble = IBlackTreeDouble(_address);
    }

    // This runs exactly when the Schedule / Keeper executes it.
    // It determines randomness strictly on-chain and enforces it on the game contract.
    function onEvent(bytes calldata /* data */) external override {
        // Simple PRNG mapping 0-14 using prevrandao and block timestamp
        uint256 seed = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp)));
        uint8 number = uint8(seed % 15);

        uint8 winningColor;
        uint256 multiplier;

        // 0 = WHITE (14x) | 1-7 = RED (2x) | 8-14 = BLACK (2x)
        if (number == 0) {
            winningColor = 3; // WHITE
            multiplier = 14;
        } else if (number >= 1 && number <= 7) {
            winningColor = 1; // RED
            multiplier = 2;
        } else {
            winningColor = 2; // BLACK
            multiplier = 2;
        }

        blackTreeDouble.executeDraw(number, winningColor, multiplier);
    }
}
