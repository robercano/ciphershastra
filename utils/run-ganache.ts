import yargs from "yargs";
import { spawn, ChildProcess } from "child_process";
import { resolve } from "path";

import { getChainConfig, NetworksType, Networks } from "../hardhat.helpers";

import { config as dotenvConfig } from "dotenv";
import { HttpNetworkConfig } from "hardhat/types";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function onExit(childProcess: ChildProcess) {
    return new Promise((resolve, reject) => {
        childProcess.once("exit", code => {
            if (code === 0) {
                resolve(undefined);
            } else {
                reject(new Error("Exit with error code: " + code));
            }
        });
        childProcess.once("error", err => {
            reject(err);
        });
    });
}

async function runLocalNode(network: NetworksType, blocktime: number | undefined) {
    const ganacheArgs = ["ganache"];

    const config = getChainConfig(network) as HttpNetworkConfig;
    ganacheArgs.push(...["-f", config.url, "--chain.chainId", String(config.chainId)]);

    // Automatic block mining time
    if (blocktime) {
        ganacheArgs.push(...["--miner.blockTime", `${blocktime}`]);
    }

    const ganache = spawn("yarn", ganacheArgs, {
        stdio: [process.stdin, process.stdout, process.stderr],
    });
    return onExit(ganache);
}

async function main(): Promise<void> {
    // Parse input arguments
    const argv = await yargs
        .option("network", {
            alias: "n",
            description: "Network to fork",
            choices: Networks,
        })
        .option("blocktime", {
            alias: "b",
            description: "Number of seconds for automatic block mining",
            type: "number",
        })
        .help()
        .alias("help", "h").argv;

    await runLocalNode(argv.network as NetworksType, argv.blocktime);
}

void main();
