// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract UndeadSolutionFactory {
    address public latestDeploy;

    //600a80600d600039806000f3fe602a60005260206000f3
    function deploy(bytes memory code, bytes32 salt) external {
        address addr;

        // solhint-disable-next-line no-inline-assembly
        assembly {
            addr := create2(0, add(code, 0x20), mload(code), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        latestDeploy = addr;
    }
}
