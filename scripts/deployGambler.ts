import { ethers } from "hardhat";
import { Gambler, SafeMath, LibGambler } from "../typechain";

async function main() {
    const [deployer] = await ethers.getSigners();

    const SafeMathFactory = await ethers.getContractFactory("SafeMath");
    const safeMathLib = (await SafeMathFactory.deploy()) as SafeMath;

    console.log("Deployed SafeMath library at", safeMathLib.address);

    const LibGamblerFactory = await ethers.getContractFactory("libGambler");
    const libGambler = (await LibGamblerFactory.deploy()) as LibGambler;

    console.log("Deployed LibGambler library at", libGambler.address);

    const GamblerFactory = await ethers.getContractFactory("Gambler", {
        libraries: {
            libGambler: libGambler.address,
            SafeMath: safeMathLib.address,
        },
    });
    const gambler = (await GamblerFactory.deploy(deployer.address)) as Gambler;

    await gambler.toggleSale();

    console.log("Deployed Gambler at address:", gambler.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
