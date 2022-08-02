# Minion

This challenge poses as a simple puzzle where we have to call the `pwn()` function in order to be registered as having pwnd the contract. In order to call the function, we need to pass several checks:

-   The function must be called from a contract:

```
    require(tx.origin != msg.sender, "Well we are not allowing EOAs, sorry");
```

-   The caller must NOT be a contract. This clearly contradicts the previous check, so it may seem difficult to pass both at the same time:

```
    require(!isContract(msg.sender), "Well we don't allow Contracts either");
```

-   The value sent to the contract must be at least 0.1 ETH and maximum 0.2 ETH:

```
    require(msg.value >= MINIMUM_CONTRIBUTION, "Minimum Contribution needed is 0.1 ether");
    require(msg.value <= MAXIMUM_CONTRIBUTION, "How did you get so much money? Max allowed is 0.2 ether");
```

-   Finally the block must be mined on an even minute. This is from the minute 0 to the minute 2, we need to call the contract in the first 60 seconds:

```
    require(block.timestamp % 120 >= 0 && block.timestamp % 120 < 60, "Not the right time");
```

If all these checks are passed, and we've sent a total of 1 ether, then we are registered as pwners in the `pwnd` map.

The solution to this puzzle passes first for realizing that we need to call the `pwn` function from the constructor of our attack contract. Why? Because when a contract is in construction, it's code size is still zero, meaning that the function `isContract`, that checks the code size of the caller, will return false, allowing us to pass the first 2 checks.

The next thing we need is to call the `pwn` function with 0.2 ETH at a time to pass the third check while accumulating some ETH on our account. We will need to call the `pwn` function 5 times in order to achieve this.

And last but not least, we need to call the function at the appropriate time. This can be done by checking the time requirement in the attack contract and failing early there if the time is not correct. If the time is correct, then we can go ahead and execute the rest of the attack.

You can find the attacking contract code [here](./contracts/solutions/MinionSolution.sol).

## Solution

Solution Contract Address: 0x12C3F96c527b9df502344733F197E7092258607A
Challenge Contract Address: 0xe3Bf6D5379fD80C44156bAa4f3D8e7F507f6bcd1

You will need to check the challenge contract internal transactions to see the calls from the solution contract

## Auto-solve

To solve this challenge you can use the following command:

```
$ yarn solve-minion:rinkeby --minion-address 0xe3Bf6D5379fD80C44156bAa4f3D8e7F507f6bcd1
```

The deployed attack contract MinionSolution address will be the one registered as being pwned the Minion contract.
