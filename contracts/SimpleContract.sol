//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleContract is Ownable {
    uint256 public value;

    /* solhint-disable-next-line no-empty-blocks */
    constructor() {}

    function increment() external {
        value += 1;
    }

    function incrementBy(uint256 amount) external {
        value += amount;
    }
}
