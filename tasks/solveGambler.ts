import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { GamblerSolution } from "../typechain";

task("solveGambler", "Solves the Gambler challenge")
    .addParam("gamblerAddress", "Address of the Gambler contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (!hre.ethers.utils.isAddress(args.gamblerAddress)) {
            throw new Error(`Invalid contract address format: ${args.gamblerAddress}`);
        }

        const signers = await hre.ethers.getSigners();

        // Use a different signer from the local deployer so we can test properly
        let signer;
        if (hre.network.name === "hardhat" || hre.network.name === "localhost") {
            signer = signers[1];
        } else {
            signer = signers[0];
        }

        const GamblerSolutionFactory = await hre.ethers.getContractFactory("GamblerSolution", signer);
        const gamblerSolver = (await GamblerSolutionFactory.deploy()) as GamblerSolution;
        await gamblerSolver.deployTransaction.wait(5);

        console.log("Deployed GamblerSolution at address:", gamblerSolver.address);

        try {
            await hre.run("verify:verify", {
                address: gamblerSolver.address,
                constructorArguments: [],
            });
        } catch (error) {
            console.error(error);
            return false;
        }

        const tx = await gamblerSolver.pwn(args.gamblerAddress);
        await tx.wait();

        console.log("Gambler solving attempt done...");

        const isSolved = await gamblerSolver.isChallengeSolved();

        if (isSolved) {
            console.log("Gambler challenge solved!");
        } else {
            console.log("Gambler challenge not solved yet");
        }
    });
