# Visual Studio Code

This README explais the specific extensions and configurations needed for VS Code to work properly with this repository.

# Setup

To make VS Code work with Yarn zero install you need to execute the following command after a succesful `yarn install`:

```
$ yarn dlx @yarnpkg/sdks vscode
```

This will install the VS Code SDKs with support for typescript and will make VS Code find all typings and references properly on the zero-install.

# Extensions

## Prettier

Code formatter directly in VS Code.

Quick Open with Ctrl+P and then type:

```
ext install esbenp.prettier-vscode
```

Reference: [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## solidity

Adds syntax highlighting, linting, code compilation and more things for VS Code. A must have for solidity development.

Quick Open with Ctrl+P and then type:

```
ext install JuanBlanco.solidity
```

## Configuration

Open the extension configuration and set the following values:

```
"solidity.packageDefaultDependenciesContractsDirectory": ""
"solidity.packageDefaultDependenciesDirectory": ""
```

Also configure Juan Blanco's plugin as the formatter for Solidity files. Open the command palette and search for `Preferences: Configure Language Specific Settings`. Selec **Solidity** from the drop down menu and make sure you have the following lines in the `settings.json` file:

```
    "[solidity]": {
        "editor.defaultFormatter": "JuanBlanco.solidity"
    },
```

Reference: [Juan Blanco](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity).

# Solidity Visual Developer

Adds code augmentation and visual security linting to solidity.

Quick Open with Ctrl+P and then type:

```

ext install tintinweb.solidity-visual-auditor

```

Reference: [Solidity Visual Developer](https://marketplace.visualstudio.com/items?itemName=tintinweb.solidity-visual-auditor)

# Solidity Metrics

Generates Source Code Metrics, Complexity and Risk profile reports for projects written in Solidity

Quick Open with Ctrl+P and then type:

```

ext install tintinweb.solidity-metrics

```

Reference: [Solidity Metrics](https://marketplace.visualstudio.com/items?itemName=tintinweb.solidity-metrics)

# MythX

Allows to run MythX smart contract analysis from VS Code. You will need to set up an account in order to use this extension.

Quick Open with Ctrl+P and then type:

```

ext install MythX.mythxvsc

```

Reference: [MythX](https://marketplace.visualstudio.com/items?itemName=MythX.mythxvsc)

# Slither

Static analysis tool for Solidity.

```

ext install trailofbits.slither-vscode

```

Reference: [Slither](https://marketplace.visualstudio.com/items?itemName=trailofbits.slither-vscode)

# ZipFS

Required to use a Yarn zero-install and be able to access files inside the Yarn packages

```

ext install arcanis.vscode-zipfs

```

Reference: [ZipFS](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs)
