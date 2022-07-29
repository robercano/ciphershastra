// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract UndeadSolution {
    function deadYet() external pure returns (bytes32 result) {
        string memory source = "UnDeAD";

        // solhint-disable-next-line no-inline-assembly
        assembly {
            result := mload(add(source, 6))
        }
    }
}
