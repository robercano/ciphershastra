# Gambler

Gambler has been a really tough one to crack. On the surface, it is a simple contracts that allows you to buy some chips, and then use those chips in a gambling game.

# Facts

Some interesting facts about the contract are:

-   Only the main contract code is presented in the Ciphershastra website. The rest of the code can be found
    in Etherscan, as the contract is verified.
-   It uses the 0.7 compiler version. There were many changes from version 0.7 to 0.8, but one of the most
    prominent ones was the introduction of built-in safe math operations. However the contracts seems to be
    using the SafeMath library, so it could still be protected against a possible overflow/underflow.
-   There is a maximum of 20 chips that a user can buy before gambling with those chips
-   Before gambling, the user must get verified by paying for the requested chips. In particular, the user
    must pay 576460752303423488 wei per chip. That is definitely a weird number. What if we convert it to
    hexadecimal to see how it looks like? We get 0x0800000000000000. That is a 64-bit number, which would
    overflow if we multiply it by 32
-   The `_safeMint` in `buyChips` will call back the caller through the `onERC721Received`, only if the caller
    is another contract. This callback comes from the `ERC721Receiver` interface and it is used to make sure
    that a caller contracts is able to receive and handle ERC721 tokens
-   The `doubleOrNothing` function calls the `libGambler` library to calculate the outcome of the dice roll.
    If we look in Etherscan for the source code of this library, we can see that it uses some data source like
    the block timestamp, the coinbase and the difficulty, to calculate the roll. All these data can be easily
    predicted by using another contract and running the same calculation there to come up with the bet to be
    used
-   If the dice roll is predicted correctly, then the account that will receive the prize in the form of NFTs,
    is calculated in a very particular way, and if we look closely we can see a typo in the `acount` parameter,
    which could be confused with the `account` storage variable.

# The Blind Spot

After looking at all the facts, the first thing that came to mind is that there could be a possible reentrancy attack. This was possible through the `onERC721Received` callback called upon `_safeMint`. This would definitely allow us to buy more chips than allowd. We could call `buyChips(16)` and then on the `onERC721Received` callback, we could call `buyChips(16)` again, thus
buying 32 chips in total. However, this would still not work as the `getVerified` function would calculate the total amount to be paid as 576460752303423488 \* 32, which would overflow and revert the transaction, due to the use of `SafeMath`

Checking the code in Etherscan over and over didn't throw any clues on what the possible attack was, until I was hinted that Etherscan may be lying to me. Lying? How?

# The Source of Truth

When you verify a contract in Etherscan, you send all the files that are involved in the compilation of the contract. However, when using libraries, you can also link an already deployed library to be used in the contract. This independent libraries must have at least one external/public function so they can be linked against. If a library has all internal functions, it will be embedded in the contract using them.

This linked libraries can be seen at the bottom of the Etherscan Code tab, in the `Libraries Used` section. What's the catch? That the source code shown in the Code tab of Etherscan, is the code that
was available at compile time for the contract. However, the code that was actually deployed for the libraries, could be different. We can see that by comparing the `libGambler` source code in the `Gambler` contract code page against the source code verified for the `libGambler` library linked in the contract, available at address `0x8674141e5af6B97D0be342C1DD157D0B8bb7ef57`.

We can see that the code is different, and that the way the dice roll is calculated has an extra suspicious parameter at the end.

Ok, so that's one difference that could have thrown off our bet calculation. But what about our amazing idea of causing an overflow?

If we look into the linked `SafeMath` library at address `0x8a5ba2bca9801BEac0A679f1D7e72a339b2Ca8c2` we also see that the code is different and that, indeed, the `mul` function is actually not protected agains overflows. Jackpot!

# The Solution Contract

Now the only thing we need to do is implement the dice roll from the actual linked `libGambler` in our solution contract, and take advantage of the reentrancy attack to solve the challenge. Our attacking function will look like this:

```solidity
        address account = 0x0000000000000000000000000000000000000000;
        uint256 bet = uint256(keccak256(abi.encodePacked(block.timestamp, block.coinbase,
                                                         account, "sus"))) % block.difficulty;

        gambler.buyChips(16);
        gambler.getVerified{ value: 0 }();
        gambler.doubleOrNothing(account, bet);
```

The Zero address is used here for `account` to force the `to` variable in `doubleOrNothing` to take the value of `msg.sender`, which is our solution contract. Then we need to prepare the callback function:

```solidity
function onERC721Received(
    address operator,
    address from,
    uint256 tokenId,
    bytes calldata data
) external returns (bytes4) {
    if (buyAgain) {
        buyAgain = false;
        gambler.buyChips(16);
    }
    return this.onERC721Received.selector;
}

```

The `buyAgain` variable is set to `true` at contract construction time, and then set to `false` once the callback is called once, so we only buy 16 chips 2 times.

## Ready to attack!

Finally we can pwn the Gambler contract. We deploy our solution contract, and then call the `pwn` function which will perform the following steps:

-   Buy 16 chips
-   Receive the callback and buy another 16 chips before the contracts blocks us out from buying more chips
-   Get verified by paying 0 wei, as the calculation will overflow but no revert will be triggered
-   Double or nothing with the calculated bet which will match the dice roll in the Gambler contract
-   Profit!

The Gamber contract mints an extra 32 chips to us, and marks our contract as a true Gambler!

## Solution Parameters

Solved by Deployer: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7
Gambler Contract Address: 0x23CB5A2D4D08ebf6b9c893D76ef2fbfe3588EfaF
Network: Goerli
Solution Contract Address: 0x2eE82881E1e378B01D9795b59b97072443ddA2dF

Solution Contract: [GamblerSolution](./contracts/solutions/GamblerSolution.sol)
Solution Script: [solveGambler](./tasks/solveGambler.ts)

## Auto-solve

To solve this challenge you can use the following command:

```
$ yarn solve-gambler:goerli --gambler-address 0x23CB5A2D4D08ebf6b9c893D76ef2fbfe3588EfaF
```
