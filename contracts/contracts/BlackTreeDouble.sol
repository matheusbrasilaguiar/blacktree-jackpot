// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BlackTreeDouble {
    address public owner;
    address public handler;

    uint256 public minBet;
    uint256 public durationInSeconds;

    enum RoundState { OPEN, LOCKED, DRAWING }
    RoundState public state;

    uint256 public roundId;
    uint256 public drawTargetTimestamp;

    // 1 = RED, 2 = BLACK, 3 = WHITE
    enum Color { NONE, RED, BLACK, WHITE }

    struct Bet {
        address player;
        uint256 amount;
    }

    // roundId => Color => Bet[]
    mapping(uint256 => mapping(Color => Bet[])) public roundBets;
    // roundId => Color => uint256
    mapping(uint256 => mapping(Color => uint256)) public poolTotals;

    event BetPlaced(address indexed player, uint8 indexed color, uint256 amount, uint256 newColorTotal, uint256 roundId);
    event RoundLocked(uint256 indexed roundId, uint256 redTotal, uint256 blackTotal, uint256 whiteTotal);
    event RoundResult(uint256 indexed roundId, uint8 number, uint8 indexed color, uint256 totalPayout);

    error NotAuthorized();
    error InvalidBetAmount();
    error RoundNotOpen();
    error InvalidColor();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAuthorized();
        _;
    }

    modifier onlyHandler() {
        if (msg.sender != handler) revert NotAuthorized();
        _;
    }

    // Allow owner/protocol to fund the house bankroll (liquidity for payouts)
    receive() external payable {}

    constructor(uint256 _minBet, uint256 _durationInSeconds) {
        owner = msg.sender;
        minBet = _minBet;
        durationInSeconds = _durationInSeconds;
        roundId = 1;
        drawTargetTimestamp = block.timestamp + _durationInSeconds;
        state = RoundState.OPEN;
    }

    function setHandler(address _handler) external onlyOwner {
        handler = _handler;
    }

    function placeBet(uint8 _color) external payable {
        if (state != RoundState.OPEN) revert RoundNotOpen();
        if (msg.value < minBet || msg.value % minBet != 0) revert InvalidBetAmount();
        
        Color color = Color(_color);
        if (color != Color.RED && color != Color.BLACK && color != Color.WHITE) revert InvalidColor();

        // Check if we passed the 45s mark (15s locked phase prior to target)
        if (block.timestamp >= drawTargetTimestamp - 15 seconds) {
            revert RoundNotOpen();
        }

        roundBets[roundId][color].push(Bet({
            player: msg.sender,
            amount: msg.value
        }));

        poolTotals[roundId][color] += msg.value;

        emit BetPlaced(msg.sender, _color, msg.value, poolTotals[roundId][color], roundId);
    }

    function executeDraw(uint8 number, uint8 winningColor, uint256 multiplier) external onlyHandler {
        state = RoundState.DRAWING;

        Color wColor = Color(winningColor);
        Bet[] memory winners = roundBets[roundId][wColor];
        
        uint256 totalPayout = 0;
        uint256 totalFee = 0;

        for (uint256 i = 0; i < winners.length; i++) {
            uint256 payout = winners[i].amount * multiplier;
            uint256 fee = (payout * 5) / 100; // 5% protocol fee
            uint256 netPayout = payout - fee;

            totalFee += fee;
            totalPayout += netPayout;

            // Payout winner directly
            _safeTransfer(winners[i].player, netPayout);
        }

        // Send accumulated fees to protocol owner
        if (totalFee > 0) {
            _safeTransfer(owner, totalFee);
        }

        emit RoundResult(roundId, number, winningColor, totalPayout);

        // Reset state for the next round
        roundId++;
        drawTargetTimestamp = block.timestamp + durationInSeconds;
        state = RoundState.OPEN;
    }

    function getPoolTotals(uint256 _roundId) external view returns (uint256 red, uint256 black, uint256 white) {
        return (
            poolTotals[_roundId][Color.RED],
            poolTotals[_roundId][Color.BLACK],
            poolTotals[_roundId][Color.WHITE]
        );
    }

    function getRoundBetsLength(uint256 _roundId, uint8 _color) external view returns (uint256) {
        return roundBets[_roundId][Color(_color)].length;
    }

    function getRoundBet(uint256 _roundId, uint8 _color, uint256 index) external view returns (address player, uint256 amount) {
        Bet memory b = roundBets[_roundId][Color(_color)][index];
        return (b.player, b.amount);
    }

    function _safeTransfer(address to, uint256 amount) internal {
        if (address(this).balance >= amount) {
            (bool success, ) = to.call{value: amount}("");
            require(success, "Transfer failed");
        }
    }
}
