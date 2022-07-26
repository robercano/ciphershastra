const shell = require("shelljs");

module.exports = {
    istanbulReporter: ["html", "text", "lcov"],
    onCompileComplete: async function (_config) {
        await run("typechain");
    },
    onIstanbulComplete: async function (_config) {
        // We need to do this because solcover generates bespoke artifacts.
        shell.rm("-rf", "./artifacts");
        shell.rm("-rf", "./typechain");
    },
    providerOptions: {
        mnemonic: process.env.MNEMONIC,
    },
    skipFiles: ["mocks", "test"],
    configureYulOptimizer: true,
};
