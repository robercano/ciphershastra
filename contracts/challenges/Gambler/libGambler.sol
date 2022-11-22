/**
 *Submitted for verification at Etherscan.io on 2022-09-03
 */

pragma solidity ^0.7.0;

library libGambler {
    function ro1lDice(uint256 bet, address account) external view returns (bool) {
        return bet == uint256(keccak256(abi.encodePacked(block.timestamp, block.coinbase, account))) % block.difficulty;
    }

    function rollDice(uint256 bet, address account) external view returns (bool) {
        return
            bet ==
            uint256(keccak256(abi.encodePacked(block.timestamp, block.coinbase, account, "sus"))) % block.difficulty;
    }
}
