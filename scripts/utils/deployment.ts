import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";

import hre from "hardhat";
import { ethers } from "hardhat";
import { Contract } from "ethers";

dotenvConfig({ path: resolve(__dirname, "../../.env") });

const NUM_CONFIRMATIONS_WAIT = 5;

export enum DeploymentFlags {
    Deploy = 1 << 0,
    Verify = 1 << 1,
    All = Deploy | Verify,
}

export async function verify(contractAddress: string, args: unknown[]): Promise<boolean> {
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        console.error(error);
        return false;
    }

    return true;
}

export async function deploy(
    contractName: string,
    args: unknown[],
    flags: DeploymentFlags = DeploymentFlags.Deploy,
): Promise<Contract> {
    let contract = null;

    if ((flags & DeploymentFlags.Deploy) !== DeploymentFlags.Deploy) {
        throw new Error("Verification without deployment is not supporte at the moment");
    }

    //
    // Commented out on purpose. For now verification without deployment is not supported, so contract
    // is always deployed, and then verification is optional
    //
    // if ((flags & DeploymentFlags.Deploy) === DeploymentFlags.Deploy) {
    const contractFactory = await ethers.getContractFactory(contractName);
    contract = await contractFactory.deploy(args);
    //}

    if ((flags & DeploymentFlags.Verify) === DeploymentFlags.Verify) {
        await contract.deployTransaction.wait(NUM_CONFIRMATIONS_WAIT);
        await verify(contract.address, args);
    }

    return contract.deployed();
}
