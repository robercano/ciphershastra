# Prerequisites

This file helps you install all pre-requisites that cannot be handled by the Yarn package manager

# Setup Node and Yarn

Node is the tool used to run most of the development tools. It is typically used to run Javascript outside the browser and it is used by most of the Smart Contracts development tools.

Yarn is one of the package managers for Node and it will allow us to install dependencies for our project.

## Install nvm

-   Download and install `nvm`

```
$ curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh -o install_nvm.sh
$ chmod +x install_nvm.sh
$ ./install_nvm.sh
```

-   Restart terminal or source the new config with

```
$ source ~/.bash_profile
```

-   Check that the `nvm` command is installed with

```
$ command -v nvm
nvm
```

If it does not return nvm, the command was not installed properly

Reference: https://heynode.com/tutorial/install-nodejs-locally-nvm/

## Install Node

-   Install the LTS (Long Term Support) version of node

```
$ nvm install --lts
```

-   Verify that it worked

```
$ node --version
v16.14.0
$ which node
/home/user/.nvm/versions/node/v16.14.0/bin/node
```

Reference: https://heynode.com/tutorial/install-nodejs-locally-nvm/

## Install Yarn

-   Enable `corepack` from Node package

```
$ corepack enable
```

-   Check the installation

```
$ yarn --version
3.2.0
```

Reference: https://yarnpkg.com/getting-started/install

# Audit Tools

These tools will help find vulnerabilities and bad practices in the code

## Slither

Slither is a static analysis tool that helps you find vulnerabilities in Solidity code. It will check for common vulnerabilities like missing `require` statements, missing `@notice` and `@payable` annotations, and so on.

```
$ pip3 install slither-analyzer
```
