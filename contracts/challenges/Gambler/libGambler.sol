pragma solidity ^0.7.0;

library libGambler {
    function rollDice(uint256 bet, address account) external view returns (bool) {
        return bet == uint256(keccak256(abi.encodePacked(block.timestamp, block.coinbase, account))) % block.difficulty;
    }
}
