import { ethers } from "hardhat";

async function main() {
    const ThirtyFiveFactory = await ethers.getContractFactory("ThirtyFive");
    const thirtyFive = await ThirtyFiveFactory.deploy("ThirtyFive", "1337");

    console.log("Deployed ThirtyFive at address:", thirtyFive.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
