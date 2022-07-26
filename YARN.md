# Yarn Zero-Install Setup

## Create a Yarn zero-install

-   Zero-installs allow for repositories to contain all files needed to start development without having to install anything. Create a `yarn` zero-install with:

```
$ yarn init -2
```

It will create several files and a _package.json_ with the project config

Reference: https://yarnpkg.com/getting-started/install

## Install yarn interactive-tools

-   These plugin adds some high-level commands to manage the project using graphical terminal interfaces

```
$ yarn plugin import interactive-tools
```

Reference: https://yarnpkg.com/features/plugins
