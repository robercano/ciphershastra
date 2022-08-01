import { ethers } from "hardhat";

async function main() {
    const shilpkaarFactory = await ethers.getContractFactory("Shilpkaar");
    const shilpkaar = await shilpkaarFactory.deploy(32907154508);

    console.log("Deployed Shilpkaar at address:", shilpkaar.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
