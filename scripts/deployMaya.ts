import { ethers } from "hardhat";
import { MERC20 } from "../typechain";

async function main() {
    const merc20Factory = await ethers.getContractFactory("MERC20");
    const merc20 = (await merc20Factory.deploy()) as MERC20;

    console.log("Deployed MERC20 at address:", merc20.address);

    const mayaFactory = await ethers.getContractFactory("Maya");
    const maya = await mayaFactory.deploy(merc20.address, "500000000000000000000");

    console.log("Deployed Maya at address:", maya.address);

    console.log("Setting MERC20 Maya address to:", maya.address);
    await merc20.setMaya(maya.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
