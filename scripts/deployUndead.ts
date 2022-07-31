import { ethers } from "hardhat";

async function main() {
    const undeadFactory = await ethers.getContractFactory("undead");
    const undead = await undeadFactory.deploy(
        "0x00000000000000000000000000000000000b100d",
        "0x00000000000000000000000000000000000fffff",
        5,
    );

    console.log("Deployed Undead at address:", undead.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
