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

Copy the `.env.template` file and name it `.env`. Fill in the following variables:

```
WALLET_SEED=''
ENDPOINT_PROVIDER=''
ENDPOINT_API_KEY=''
```

Where the wallet seed is your wallet mnemonic, the endpoint provider is one of `'infura'` or `'alchemy'`, and the endpoint API key is the API key for the selected API provider (Infura or Alchemy)/

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

Read the solution [here](./README-sherlock.md)

# Minion

Read the solution [here](./README-minion.md)

# Limitless

Read the solution [here](./README-limitless.md)

# Undead

Read the solution [here](./README-undead.md)

# Shilpkaar

Read the solution [here](./README-shilpkaar.md)

# ThirtyFive

Read the solution [here](./README-thirtyfive.md)

# Maya

Read the solution [here](./README-maya.md)

# Gambler

Read the solution [here](./README-gambler.md)
