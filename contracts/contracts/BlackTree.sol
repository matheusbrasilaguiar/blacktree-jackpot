// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BlackTree {
    address public owner;
    address public handler;

    uint256 public ticketPrice;
    uint256 public durationInSeconds; // Duration of a round

    uint256 public currentJackpot;
    uint256 public roundId;
    uint256 public drawTargetTimestamp;

    address[] public participants;

    event TicketPurchased(
        address indexed participant,
        uint256 newJackpot,
        uint256 roundId
    );
    event JackpotWon(
        uint256 indexed roundId,
        address first,
        address second,
        address third,
        uint256 totalPrize
    );

    error IncorrectTicketPrice();
    error NotAuthorized();
    error RoundAlreadyClosed();
    error NotEnoughParticipants();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAuthorized();
        _;
    }

    modifier onlyHandler() {
        if (msg.sender != handler) revert NotAuthorized();
        _;
    }

    constructor(uint256 _ticketPrice, uint256 _durationInSeconds) {
        owner = msg.sender;
        ticketPrice = _ticketPrice;
        durationInSeconds = _durationInSeconds;
        roundId = 1;
        drawTargetTimestamp = 0; // 0 means the timer hasn't started yet!
    }

    function setHandler(address _handler) external onlyOwner {
        handler = _handler;
    }

    function enter() external payable {
        if (msg.value != ticketPrice) revert IncorrectTicketPrice();
        if (block.timestamp >= drawTargetTimestamp && participants.length >= 2 && drawTargetTimestamp != 0) {
            revert RoundAlreadyClosed(); 
            // Ensures nobody enters while the handler is waiting to execute
        }

        participants.push(msg.sender);
        currentJackpot += msg.value;

        // Start the countdown timer ONLY when the 2nd valid player enters
        if (participants.length == 2) {
            drawTargetTimestamp = block.timestamp + durationInSeconds;
        }

        emit TicketPurchased(msg.sender, currentJackpot, roundId);
    }

    // Called automatically by any Keeper when the countdown reaches 0
    function executeDraw() external {
        uint256 length = participants.length;
        if (length < 2) revert NotEnoughParticipants();
        if (block.timestamp < drawTargetTimestamp) revert("Timer has not ended yet");
        // We ensure nobody can run the draw multiple times
        if (drawTargetTimestamp == 0) revert("Draw already executed");

        uint256 totalPrize = currentJackpot;
        
        address first;
        address second;
        address third;

        {
            uint256 seed1 = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, "first")));
            first = participants[seed1 % length];
            
            uint256 seed2 = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, "second")));
            uint256 attempts = 0;
            do {
                second = participants[(seed2 + attempts) % length];
                attempts++;
            } while(second == first && attempts < length);

            if (length > 2) {
                uint256 seed3 = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, "third")));
                attempts = 0;
                do {
                    third = participants[(seed3 + attempts) % length];
                    attempts++;
                } while((third == first || third == second) && attempts < length);
            }
        }

        uint256 protocolFee = (totalPrize * 5) / 100;

        emit JackpotWon(roundId, first, second, third, totalPrize);

        // Reset state for the next round
        delete participants;
        currentJackpot = 0;
        roundId++;
        drawTargetTimestamp = 0; // Timer waits for the next 2 players

        // Distribute funds
        {
            uint256 prizeFirst;
            uint256 prizeSecond;
            uint256 prizeThird;

            if (length == 2) {
                prizeFirst = (totalPrize * 75) / 100;
                prizeSecond = totalPrize - protocolFee - prizeFirst;
            } else {
                prizeFirst = (totalPrize * 70) / 100;
                prizeSecond = (totalPrize * 20) / 100;
                prizeThird = totalPrize - protocolFee - prizeFirst - prizeSecond;
            }

            if (prizeFirst > 0 && first != address(0)) _safeTransfer(first, prizeFirst);
            if (prizeSecond > 0 && second != address(0)) _safeTransfer(second, prizeSecond);
            if (prizeThird > 0 && third != address(0)) _safeTransfer(third, prizeThird);
        }

        if (protocolFee > 0) _safeTransfer(owner, protocolFee);
    }

    function getParticipants() external view returns (address[] memory) {
        return participants;
    }

    function _safeTransfer(address to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
