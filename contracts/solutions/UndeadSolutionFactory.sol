// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./UndeadSolution.sol";

contract UndeadSolutionFactory {
    UndeadSolution public latestDeploy;

    function deploy(bytes32 salt) external {
        latestDeploy = new UndeadSolution{ salt: salt }();
    }
}
