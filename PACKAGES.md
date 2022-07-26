# Packages Setup

These is the list of packages installed in the repository

# Setup Hardhat

Hardhat is the Smart Contracts development tool itself. It helps us manage the Solidity compiler, connecting to a local blockchain and deploying contracts to the real blockchains.

## Install Hardhat

```
$ yarn add -D hardhat
```

## Install Ethers for Hardhat

Ethers is one of the libraries that can be used to access the blockchain. It has an abstraction layer for contracts, wallets, signers, and so on

```
$ yarn add -D @nomiclabs/hardhat-ethers 'ethers@^5.0.0'
```

Reference: https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html

## Add Typescript support

Typescript is a typed Javascript. The typings help the development because they are checked and also the editors can show more information on functions and classes parameters.

```
$ yarn add -D ts-node typescript @types/node
```

Config file: [tsconfig.json](tsconfig.json)

Reference: https://hardhat.org/guides/typescript.html

## Install typechain for hardhat

Typechain will help generating typescript bindings for the Solidity contracts at compile time. Then this bindings can be used to access the contracts using typescript.

```
$ yarn add -D typechain @typechain/hardhat @typechain/ethers-v5 @ethersproject/bytes @ethersproject/abi @ethersproject/providers
```

Reference: https://www.npmjs.com/package/@typechain/hardhat

# Add hardhat plugins

## Gas Reporter

A plugin that reports the amount of gas spent on each contract's functions. Useful to estimate deployment and operations cost

```
$ yarn add -D hardhat-gas-reporter
```

Reference: https://www.npmjs.com/package/hardhat-gas-reporter

## Contract Sizer

This plugin reports the size of each Solidity contract. Currently there is a limit on the contract size and if the contract goes above it, it will be rejected when trying to deploy it

```
$ yarn add -D hardhat-contract-sizer
```

Reference: https://www.npmjs.com/package/hardhat-contract-sizer

## ABI Exporter

This plugin exports the ABI of the contracts into a specific directory, and it also allows to output a compact ABI format that is useful in some scenarios:

```
$ yarn add -D hardhat-abi-exporter
```

Reference: https://www.npmjs.com/package/hardhat-abi-exporter

## Etherscan

This plugin helps verifying the contracts on Etherscan.

```
$ yarn add -D @nomiclabs/hardhat-etherscan
```

Reference: https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan

## Waffle Testing Framework

Waffle is a testing framework that uses _Chai_ and _Mocha_ and allows to write tests that can be run directly from _Hardhat_

```
$ yarn add -D @nomiclabs/hardhat-waffle 'ethereum-waffle@^3.0.0' chai chai-ethers-bn mocha @types/chai @types/mocha
```

Reference: https://hardhat.org/plugins/nomiclabs-hardhat-waffle.html

## Solidity Coverage

Useful to get statistics on the test coverage for your contracts. It will report the percentage of code covered and the uncovered lines

```
$ yarn add -D solidity-coverage shelljs
```

Config file: [.solcover.js](.solcover.js)

Reference: https://www.npmjs.com/package/solidity-coverage

# Ganache

This is a local blockchain that can be used to test smart contracts. It has the ability to quickly fork a real blockchain and it is a great addition to the local Hardhat node.

```
$ yarn add -D ganache
```

# Prettier

This tool takes care of formatting your code in a proper way and keeping all code of the same language with the same format

```
$ yarn add -D prettier prettier-plugin-solidity
```

Config files: [.prettierignore](.prettierignore) and [.prettierrc.yaml](.prettierrc.yaml)

# Linting Tools

Linters are a special set of tools that help identifying bad syntax in languages like Javascript. In other cases like the linter of Solidity, the tool focuses on good practices and finding possible vulnerabilities in the code

## eslint

Install with its Prettier plugin as well

```
$ yarn add -D eslint eslint-config-prettier eslint-plugin-import @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Config files: [.eslintignore](.eslintignore) and [.eslintrc.yaml](.eslintrc.yaml)

Reference: https://github.com/eslint/eslint#installation-and-usage

## solhint

Install with its Prettier plugin as well

```
$ yarn add -D solhint solhint-plugin-prettier
```

Config files: [.solhint.json](.solhint.json) and [.solhintignore](.solhintignore)

Reference: https://github.com/protofire/solhint

# OpenZeppelin

This set of contracts provides the most common functionality for the development of smart contracts. They are battle tested and will increase the security of yout contracts.

```
$ yarn add -D @openzeppelin/contracts
```

# System Tools

## dotenv

_dotenv_ allows the loading of environment variables into our scripts. This is a standard way of defining variables specific to the environment without checking them into the repository

```
$ yarn add -D dotenv
```

Reference: https://www.npmjs.com/package/dotenv

## yargs

_yargs_ is a library for input parameter parsing. It is ideal for scripts that act as command line tools

```
$ yarn add -D yargs @types/yargs
```

Reference: https://www.npmjs.com/package/yargs

## cross-env

Allows to set environment variables on different systems without worrying about the syntax

```
$ yarn add -D cross-env
```

Reference: https://www.npmjs.com/package/cross-env

## fs-extra

For project files management

```
$ yarn add -D fs-extra @types/fs-extra
```

## cli-progress

Create more verbose command line scripts that provide an indication of current progress

```
$ yarn add -D cli-progress
```

## console-log-colors

Create better command line scripts by adding colors and making them more beautiful and useful

```
$ yarn add -D console-log-colors
```

# husky

Git hooks made easy. Helper to run pre-commit hooks before pushing to the remote repository

```
$ yarn add -D husky
$ npx mrm@2 lint-staged
```
