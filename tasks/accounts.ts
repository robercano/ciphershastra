import { Signer } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { task } from "hardhat/config";
import { HardhatNetworkHDAccountsConfig } from "hardhat/src/types";

task("accounts", "Prints the list of accounts", async (_taskArgs, hre) => {
    const signers: Signer[] = await hre.ethers.getSigners();

    let mnemonic: string;
    let path: string;
    if (hre.network.name === "hardhat") {
        const accounts = hre.network.config.accounts as HardhatNetworkHDAccountsConfig;
        mnemonic = accounts.mnemonic;
        path = accounts.path;
    }

    await Promise.all(
        signers.map(async function (signer: Signer, index: number) {
            const address = await signer.getAddress();
            const balance = await signer.getBalance();
            const ether = formatUnits(balance, "ether");

            console.log(`Account #${index}: ${address} (${ether} ETH)`);

            if (hre.network.name === "hardhat") {
                const account = hre.ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(path + index.toString());
                console.log(`Private Key: ${account.privateKey}\n`);
            }
        }),
    );
});
