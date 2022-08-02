# Shilpkaar

With difference, one of the most annoying puzzles of the set. From Wikipidia, [Shilpkar](https://en.wikipedia.org/wiki/Shilpkar) are _an artisan community mainly associated with Intaglio techniques and painting_. This is indeed a hint on what must be done in order to solve the puzzle. In particular, to solve this puzzle, we will need to carefully craft a set of data that allows us to pass the multiple complex checks inside the challenge contract.

But first of all we need to find the key to the first lock, which is hidden in plain sight.

## Unlock

Looking at the functions we can see that the `roulette()` function is first protected by the requirement of the called to be in the `shilpkaar` mapping. Looking at the contract it seems the only possible way of achieving this is by calling the `unlock()` function first and passing all the checks.

However the unlock function first check seems to lock us out of calling it at all! The first check needs the state variables `gate1Unlocked` and `gate2Unlocked` to be set to `true`. These 2 variables are unitialized (meaning they are both false) and they are not set anywhere.

Typically when presented with a puzzle like this, there is either an array underflow to be exploited, or a more subtle one in the shape of complex data type declared locally without specifying its data location. What does this mean? Back in Solidity 0.4 you could declare a local complex variable (like a struct) without specifying its data location. If you didn't specify it then it would, by default, be pointing to a storage location. In particular to the slot 0 of the contract storage. This is OK as far as you don't write to it and just use it to later on point it to the right location. However, if you would write to it before pointing it to a valid location...it would directly overwrite the contents of the contract storage starting from the slot 0.

This is exactly what is happening in the `unlock` function:

```
  function unlock(bytes32 _name, bytes32 _password) external {
        regInfo regRecord;
        regRecord.name = _name;
        regRecord.password = _password;
```

`regRecord` is declared but not pointed to a valid location, and then it's members are set to `_name` and `_password`. Because `regRecord.name` and `regRecord.password` are `bytes32` variables, they are actually pointing to the slot 0 and slot 1 of the contract storage (each slot is 32 bytes long).

This gives us control over the first two slots of the contract storage.

The second part of this section of the puzzle is to realize that there is more than 1 variable mapped to the slot 0, and that the same follows for the slot 1. In particular:

```
    // Slot 0
    address private garbageAddress;  //         160 bits
    bool private gate1Unlocked;      //         8 bits
    uint16 private gateKey1;         //         16 bits
    uint72 public rouletteStartTime; //         72 bits
                                     // TOTAL   256 bits = 32 bytes = 1 slot

    // Slot 1
    uint64 private gateKey2;         //         64 bits
    uint64 private gateKey3;         //         64 bits
    bool private gate2Unlocked;      //         8 bits
    uint64 private gateKey4;         //         64 bits
    uint56 private gateKey5;         //         56 bits
                                     // TOTAL   256 bits = 32 bytes = 1 slot
```

With this information we can craft a set of data that will allow us to pass the multiple checks inside the challenge contract.

The values for `gate1Unlocked` and `gate2Unlocked` are set to `true` to pass the first check. Then the second check requires us to fill in the `garbageAddress` variable with a value that meets the folowing expectation:

```
        require(
            uint256(garbageAddress) > 2**153 + garbageNonce &&
                uint256(garbageAddress) <= 2**160 - ((garbageDivisor - 1) - garbageNonce),
            "Problem With garbageAddress"
        );
```

Looking at the condition and assuming that the values for `garbageDivisor` and `garbageMultiplier`

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
