# CypherShastra

The [CipherShastra](https://ciphershastra.com) challenges are a set of puzzles that are designed to test your Solidity and Ethereum knowledge. This repository contains all the solutions to the puzzles
up to the date of the latest commit.

The repository intends to be a reference for devs looking for an insight on this solutions and to help
deepen their knowledge. Please don't just copy this solutions and solve the puzzles. It is much more
interesting if you try first yourself.

# How to get started

Install all dependencies with:

```
$ yarn
```

To deploy the local version of the puzzle and run the solution against that version, you must run a local hardhat node first. To do this run the following command:

```
$ yarn hardhat:localnode
```

Then you can deploy the local version of the puzzle with:

```
$ yarn deploy-{puzzle}:local
```

# Puzzles

## Sherlock

The Sherlock challenge is a puzzle that tests your knowledge on the layout of Solidity storage and
its different types. In particular you need to know how to access storage slots that are not public,
how to access static arrays, dynamic arrays and mappings using value types as a key.

Some good reading about it: [Solidity Storage Layout](https://docs.soliditylang.org/en/v0.8.14/internals/layout_in_storage.html).

For this puzzle you want to start analyzing all the storage variables to see what you can find. When reading this variable you will notice that some of them are **packed** into the same slot. Solidity tries to optimize the storage and will use this packed format if possible. By analyzing this packing
you can understand which slot each state variable is using.

One thing that you must know is that Solidity does NOT reserve a storage slot for constants or immutables. These are instead substituted in all the code with the value defined at compile time (in the case of constants) or at construction time (in the case of immutables).

With all this information we can infer that the `passwords` dynamic array is using the slot 13 and the
`destiny` mapping the slot 14.

To read the `passwords` dynamic array we need to find the actual storage slot where the dynamic information of the array is stored. Solidity uses the `keccak256` function to calculate this slot. In particular it hashes the slot where the storage variable is declared (13 in this case), and the resulting value is the slot where the dynamic information is stored.

Using this we can read the dynamic array and see the different users and their passwords stored there:

```
------------------------------------------------------
Storage slot 13 contents (passwords dynamic array):
------------------------------------------------------
- Passwords[0]:
    name: sherlock
    secretKey: 0x000000000000000000000000000000000000000000000000000000000000848f
    password: 0x738e58e5a6aacbcf070d643ca922d8570351454244da967af8e88dd6978a8b4d
- Passwords[1]:
    name: watson
    secretKey: 0x000000000000000000000000000000000000000000000000000000000000a5d1
    password: 0x51fab89b6e070ab21f77b47ec1ba73118b854ab25aec44b57c0b4b5d4676f70f
- Passwords[2]:
    name: lestrade
    secretKey: 0x0000000000000000000000000000000000000000000000000000000000018625
    password: 0xff660a352d1b1fa5212ae711bd43b865c419df193d7ee36296e572e212cef8e6
- Passwords[3]:
    name: mycroft
    secretKey: 0x0000000000000000000000000000000000000000000000000000000000010dcd
    password: 0xcc64d9de9309bb27cf2a5cb890d3b16436f3f7b7464045404c9cdfca2a4f2f2d
- Passwords[4]:
    name: molly
    secretKey: 0x0000000000000000000000000000000000000000000000000000000000000017
    password: 0x93ca83d18ed3e6bcfab50d0517a7b4c1e62add67309e1dd254d51d3e4e63a282
- Passwords[5]:
    name: its-n0t-h3r3
    secretKey: 0x0000000000000000000000000000000000000000000000000000000000000000
    password: 0x4e0585a0c158724005b34f15aa3ee4fabda5f199b842346f5af1dceea1ef523f
```

However the last user is hinting us that the password for user `razzor` is not here. Let's head over to the destiny mapping and see what is in there. For a mapping, the slot for the contents of a value are calculated in a different way. If they key is a value type (like a `uint256`), then the slot where the value for that key is stored is calculated as:

```
keccak256(keccak256(uint256(key)) + uint256(slot))
```

Where the `+` symbol means concatenation of the two values. Calculating this slot value for the key `0`, we find our answer:

```
------------------------------------------------------
Storage slot 14 contents (destiny mapping):
------------------------------------------------------
- destiny[0]:
    name: razzor
    secretKey: 0x0000000000000000000000000000000000000000000000000000000000000001
    password: 0xcd7bfc1df0a853a60c6d1fddc112e54eb4e1c7c25144889e2263e4334da67945
```

If we use the found password in the website, it will confirm that we've solved the challenge.

# Minion

Deploy the solution contract at the right time and do everything in the constructor

# Limitless

Just make sure to dis-approve the approved amount after you stake the tokens

# Undead

Solved by deployer: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7
Solution contract address: 0xf845763a8d905CFD270aa85dB100d7bfc7bA3806
UnDeAD map id: 0x2ad8753d9f3276d2501d282f2f5e47524164dd47fc38b231cb1e41edc5be315b

# Shilpkaar

Solved by deployer: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7
Solution contract address: 0x16c0dBDD7eEe418C7342a2A81737e6Bb9b3BE4F8

# ThirtyFive

Solved by deployer: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7

# Maya

Solved by deployer: 0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7
