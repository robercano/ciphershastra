import { ethers } from "hardhat";

/**
 * Deploy SimpleContract
 */
async function main() {
    const minionFactory = await ethers.getContractFactory("Minion");
    const minion = await minionFactory.deploy();

    console.log("Deployed Minion at address:", minion.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
