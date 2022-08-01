import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { Shilpkaar, ShilpkaarSolution } from "../typechain";

task("solveShilpkaar", "Solves the Shilpkaar challenge")
    .addParam("shilpkaarAddress", "Address of the exploitable contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (!hre.ethers.utils.isAddress(args.shilpkaarAddress)) {
            throw new Error(`Invalid contract address format: ${args.shilpkaarAddress}`);
        }

        const ShilpkaarFactory = await hre.ethers.getContractFactory("Shilpkaar");
        const shilpkaarChallenge = (await ShilpkaarFactory.attach(args.shilpkaarAddress)) as Shilpkaar;

        const ShilpkaarSolutionFactory = await hre.ethers.getContractFactory("ShilpkaarSolution");
        const shilpkaarSolution = (await ShilpkaarSolutionFactory.deploy()) as ShilpkaarSolution;

        console.log(`Deployed ShilpkaarSolution at ${shilpkaarSolution.address}`);

        console.log(`Solving Shilpkaar challenge...`);
        const tx = await shilpkaarSolution.pwn(shilpkaarChallenge.address);
        await tx.wait();

        const conquered = await shilpkaarChallenge.conquerors(shilpkaarSolution.address);
        if (conquered === true) {
            console.log("You have conquered the Shilpkaar challenge!");
        } else {
            console.log("You have NOT conquered the Shilpkaar challenge...");
        }
    });
