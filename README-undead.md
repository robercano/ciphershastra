# Undead

This puzzle requires a bunch of skills in order to solve it. The only external function we have available is the `deadOrAlive` function. In this function there are several checks that we must meet so we can have our hashed address set as `true` in the `UnDeAD` mapping, which proves that we've passed the challenge.

## Mortality

The first check we find is a simple gateway to now allow us to hack the contract twice from the same calling address. The next one is a check for "mortality". This one checks if the caller address has a certain pattern in the address. This pattern is stored in the `want` public variable. When querying it, we can see that the bytes "0x0b100d" are returned. This pattern is required to be present in the address of the caller in order to pass the check. But how? Well this kind of check suggests that we need to be able to control the address where the solution contract will be deployed. In order to do that we need to use the `CREATE2` opcode that deploys a contract in a predictable address by using the deployed address, the deployed contract bytecode and a Salt as a seed for generating the final deployment address.

By modifying the Salt we can affect the resulting deployment address. So we just need to iterate the Salt until we find an address that contains the required pattern, thus brute-forcing our way to the first check.

A script to find a salt that generates a specific pattern in the deployment address is available [here](./scripts/utils/findAddress.ts). It will increment salt until it finds the pattern in the address and then returns the salt and the generated address.

This is used in the [solution script](./tasks/solveUndead.ts) to find the salt that generates the correct address.

Then we've prepared a [Factory contract](./contracts/solutions/UndeadSolutionFactory.sol) that will deploy the solution contract. It will use the salt to generate the address with the required pattern and deploy the contract.
)

## Dead Yet

The third check (we'll skip the second for now) requires the solution contract to return the encoded bytes for the string **"UnDeAD"** when the function `deadYet()` is called on it. The contract will return the bytes `0x556e44654144` which are the ascii codes for **"UnDeAD"**. This is easy to do in a Solidity contract, but as we will see in the next section, it will get complicated because of the second check.

## Mini-contract

The second check in the Undead contract forces the solution contract to only have 15 bytes of code. If we create the contract in Solidity and compile it, even with size optimizations, we will see that we cannot get less than 140 bytes of code. This immediately prevents the use of Solidity for creating the solution contract.

Another way we could create it is by using Yul, the assembler language for the EVM. A minimum Yul contract would look something like this:

```
    object "Token" {
        code {
            // Store the creator in slot zero.
            sstore(0, caller())

            // Deploy the contract
            datacopy(0, dataoffset("runtime"), datasize("runtime"))
            return(0, datasize("runtime"))
        }
        object "runtime" {
            code {
                // Protection against sending Ether
                require(iszero(callvalue()))

                // Dispatcher
                switch selector()
                case 0x70a08231 /* "balanceOf(address)" */ {
                    returnUint(balanceOf(decodeAsAddress(0)))
                }
                case 0x18160ddd /* "totalSupply()" */ {
                    returnUint(totalSupply())
                }
                case 0xa9059cbb /* "transfer(address,uint256)" */ {
                    transfer(decodeAsAddress(0), decodeAsUint(1))
                    returnTrue()
                }
                case 0x23b872dd /* "transferFrom(address,address,uint256)" */ {
                    transferFrom(decodeAsAddress(0), decodeAsAddress(1), decodeAsUint(2))
                    returnTrue()
                }
                case 0x095ea7b3 /* "approve(address,uint256)" */ {
                    approve(decodeAsAddress(0), decodeAsUint(1))
                    returnTrue()
                }
                case 0xdd62ed3e /* "allowance(address,address)" */ {
                    returnUint(allowance(decodeAsAddress(0), decodeAsAddress(1)))
                }
                case 0x40c10f19 /* "mint(address,uint256)" */ {
                    mint(decodeAsAddress(0), decodeAsUint(1))
                    returnTrue()
                }
                default {
                    revert(0, 0)
                }
            }
        }
    }
```

The `code` section takes care of copying the runtime into the blockchain, and then the `runtime` does 2 things: checks that no value is sent in a call, and then dispatches the call to the correct function by using the selector. The `code` section cannot be skipped, but the `runtime` section can be reduced at a minimum. We can remove the `callvalue()` check, and then just use the `default` case to return the required value. This means that the contract will return the required bytes for any function call, like if we had defined the `fallback()` function to return the bytes for the string "UnDeAD".

The final Yul contract looks like this:

```
    object "YulContract" {
        code {
            datacopy(0, dataoffset("runtime"), datasize("runtime"))
            return (0, datasize("runtime"))
        }
        object "runtime" {
            code {
                mstore(0,  0x556e44654144) // UnDeAD
                return(0, 0x20)
            }
        }
    }
```

It stores the required bytes in at the memory address 0:

```
    mstore(0,  0x556e44654144) // UnDeAD
```

and then returns 32 (0x20) bytes from there (which is exactly what the Undead contract expects):

```
    return(0, 0x20)
```

The previous Yul code was compiled in Remix and the resulting bytecode copied to the solution script:

```
    0x600f80600d600039806000f3fe65556e4465414460005260206000f3
```

## Ready to attack!

With all this we are ready to attack the Undead contract. We deploy the factory contract, find the required salt for the current deployer and the given bytecode for the Yul contract. Then deploy the solution contract through the factory using the found Salt, and finally pass the deployed solution contract address to the Undead contract to verify the submission. And voilá!

## Solution Parameters

Solved by Deployer: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7
Undead Contract Address: 0x8B8AD617e1F95f03c971eB1e199FDf8BBfA32124
Network: Rinkeby
Solution Contract Address: 0xf845763a8d905CFD270aa85dB100d7bfc7bA3806
UnDeAD map id: 0x2ad8753d9f3276d2501d282f2f5e47524164dd47fc38b231cb1e41edc5be315b

Solution Contract: [UndeadSolutionFactory](./contracts/solutions/UndeadSolutionFactory.sol)
Solution Script: [solveUndead](./tasks/solveUndead.ts)

## Auto-solve

To solve this challenge you can use the following command:

```
$ yarn solve-undead:rinkeby --undead-address 0x8B8AD617e1F95f03c971eB1e199FDf8BBfA32124
```

The deployed attack Yul contract ddress will be the one registered as being pwned the Minion contract.
