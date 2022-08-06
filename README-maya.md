# Maya

This one was really difficult to analyze. Once you find the culprit it was easy to implement though. The challenge throws at you a full system comprised of an ERC20 contract with faucet capabilitites plus an NFT contract where you can purchase NFTs by using the ERC20 token.

The system is made in such a way that you can purchase and own just 1 NFT at a time. This is due to the ERC20 contract limiting the faucet to people that have a balance of 0 for the ERC20 and have not purchased any Maya NFT:

```
        require(
            balanceOf(msg.sender) == 0 && IMaya(Maya).balanceOf(msg.sender) == 0,
            "Everyone likes free money, right?"
        );
```

This prevents us from getting enough ERC20 tokens to purchase more than 1 NFT. We could always burn the NFT, get more tokens, and then purchase a new one, but that won't cut it.

The MERC20 contract also prevents us from transferring tokens to other wallet, and the Maya contract prevents us from transferring the NFT to other wallet, thus locking us into having a single NFT.

It would be great though if we could purchase an NFT for free, without spending our MERC20. Is it possible?

## SafeERC20 and Exceptions

There is one particlar behaviour that is of interest to us here: The SafeERC20 helper from OpenZeppelin is quite resilient to exceptions. Because it allows an ERC20 to not return a boolean value after a transfer, it does not check the return value for a low level `call`. However in the documentation for `call` it is stated that you must check the return value as otherwise you may miss on the call having failed.

This all means that if an exception ocurrs inside the `transfer` function called through `safeTransfer` (or their `transferFrom` equivalents), the calling contract WILL NOT realize that it failed.

And how can we make such a function fail? For example if we didn't have enough approval or enough tokens to be transferred, it would fail. Unfortunately this 2 cases are pre-checked in the `buy` function in the Maya contract:

```
        require(token.balanceOf(msg.sender) >= price, "Insufficient balance");
        require(token.allowance(msg.sender, address(this)) >= price, "Insufficient Allowance");
```

So we cannot use them to make the transfer fail.

## Gas Savings to the Save!

Well, there is a third way we can make a function call fail: if it does not have enough gas to execute. What does it mean? That if we adjust the amount of gas sent along the transaction so it just fails inside the transfer call, we may have a winner.

Looking at the `buy` function in the Maya contract, there is also a hint that points to that direction: the `buy` function ends with the transfer call, so if it fails, there is nothing else to be executed and the `buy` function will succeed:

```
        function buy() external {
                require(token.balanceOf(msg.sender) >= price, "Insufficient balance");
                require(token.allowance(msg.sender, address(this)) >= price, "Insufficient Allowance");
                uint256 tokenId = _tokenIdCounter.current();
                _tokenIdCounter.increment();
                _mint(msg.sender, tokenId);
                allIds[msg.sender].push(tokenId);

                token.safeTransferFrom(msg.sender, address(this), price);
        }
```

Unfortunately for some strange reason **Ethers.js** is miscalculating the estimated gas in this challenge, and it is already sending **less** gas than needed when calling the `buy` function. This means that you can pass the challenge without ever adjusting the gas sent along with the transaction. But the intended behaviour of the challenge was the explained above.

## Solution

Solved by deployer: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7

Solution Contract: [MayaSolution](./contracts/solutions/MayaSolution.sol)
Solution Script: [solveMaya.ts](./tasks/solveMaya.ts)

## Auto-solve

To solve this challenge you can use the following command:

```
$ yarn solve-thirtyfive:rinkeby --thirtyfive-address 0xD1970e2E77dCB4Af320284AD72034c6F7F4d5791
```
