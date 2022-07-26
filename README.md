# Smart Contracts Template Repo

This repository is a Yarn zero-install repository for Smart Contracts development. It uses the following tools/libraries:

-   **Yarn**
-   **Hardhat**
-   **solc**
-   **Typechain/Typescript**
-   **OpenZeppelin**
-   **Ethers.js**

## Setup

### Install Dependencies

To start using this repo, first you need to have Node and Yarn installed. If you don't have them and don't know how to install them, you can refer to the [PREREQUISITES.md](./PREREQUISITES.md) installation instructions.

Then you can install all dependencies using the following command:

```
$ yarn install
```

### VS Code

If you are using VS Code, please read the file [VSCODE.md](./VSCODE.md) to install the local VS Code SDK plus all the necessary plugins for this repo.

### Setup your .env file

Copy the [.env.template](.env.template) file into a **.env** file and fill in the values. You will need to fill at least the following values:

-   **WALLET_SEED** - The seed of the wallet that will be used to deploy the contracts.
-   **ENDPOINT_PROVIDER** - The endpoint provider that will be used to connect to the blockchain. It can be **'infura'** or **'alchemy'**
-   **ENDPOINT_API_KEY** - The API key from your endpoint provider.

You can also fill in the following values, but they are optional:

-   **MAX_GAS** - The maximum gas that will be used to deploy the contracts or perform a transaction.
-   **GAS_PRICE** - The gas price that will be used when doing a transaction on the blockchain
-   **ETHERSCAN_API_KEY** - The API key for Etherscan for contract verification. It can also be a JSON object with keys for each block scanner. Check [Hardhat Block Explorers](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#multiple-api-keys-and-alternative-block-explorers) for more information

## Commands

All the tools are configured with some plugins to get the most out of them. Some pre-configured commands are also provided in **package.json**.

### Local Blockchain

-   `hardhat:localnode` runs a Hardhat local chain for testing
-   `hardhat:accounts` shows all the accounts in the local chain
-   `ganache:rinkeby` runs a Ganache local chain forking from Rinkeby
-   `ganache:mainnet` runs a Ganache local chain forking from mainnet

### Contracts

-   `contracts:clean` cleans the compilation
-   `contracts:typechain` generates all typescript bindings for the contracts
-   `contracts:compile` compiles the contracts usin `solc`
-   `contracts:analyze` uses Slither to do static analysis of the contracts
-   `contracts:test` runs the tests for the Solidity contracts
-   `contracts:coverage` generates a code coverage report from the Solidity tests
-   `contracts:size` provides information about the contracts size

### Deployments

-   `deploy:local` tries to deploy the contracts on the local chain
-   `deploy:rinkeby` tries to deploy the contracts on the Rinkeby network
-   `deploy:mainnet` tries to deploy the contracts on the mainnet network

## Formatting

-   `lint` runs the linter for Solidity contracts. This includes the Solidity and TS linters, and the prettier code formatter plugin
-   `lint:sol` runs the Solidity linter
-   `lint:ts` runs the TS linter
-   `prettier` runs the prettier linter and formats all supported files according to the configuration
-   `prettier:check` runs the prettier linter and informs if there are any formatting errors

## Repository

For more information on how to create your own repo like this one, you can read the [YARN.md](./YARN.md) and [PACKAGES.md](./PACKAGES.md) guides.

# Author

My name is Roberto Cano, I'm a Blockchain Engineer and Founder of **The Solid Chain**. You can find me on:

-   [The Solid Chain](https://thesolidchain.com)
-   [Twitter](https://twitter.com/robersoca)
-   [Github](https://github.com/robercano)
-   [LinkedIn](https://www.linkedin.com/in/robercano/)

# The Solid Chain

-   [Twitter](https://twitter.com/TheSolidChain)
-   [Github](https://github.com/robercano)
-   [LinkedIn](https://www.linkedin.com/company/thesolidchain/)
-   [Medium](https://medium.com/@thesolidchain)

MIT License (see [LICENSE.md](./LICENSE.md))

Copyright (c) 2022 [Roberto Cano](https://github.com/robercano) & [The Solid Chain](https://thesolidchain.com)
