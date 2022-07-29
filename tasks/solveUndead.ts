import { findSaltToMatch } from "../scripts/utils/findAddress";
import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { UndeadSolutionFactory, Undead } from "../typechain";

task("solveUndead", "Solves the Undead challenge")
    .addParam("undeadAddress", "Address of the exploitable contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (!hre.ethers.utils.isAddress(args.undeadAddress)) {
            throw new Error(`Invalid contract address format: ${args.undeadAddress}`);
        }

        /**
         * YUL code that returns the string "UnDeAD" encoded as a bytes32 when any function
         * is called on the contract. Used to achieve the 15 bytes size requirement. The bytecode
         * for the YUL contract is the value of the `minimalUndeadCode` variable.
         */
        // object "YulContract" {
        //     code {
        //         datacopy(0, dataoffset("runtime"), datasize("runtime"))
        //         return (0, datasize("runtime"))
        //     }
        //     object "runtime" {
        //         code {
        //             mstore(0,  0x556e44654144) // UnDeAD
        //             return(0, 0x20)
        //         }
        //     }
        // }
        const minimalUndeadCode = "0x600f80600d600039806000f3fe65556e4465414460005260206000f3";

        const UndeadSolutionCreate2Factory = await hre.ethers.getContractFactory("UndeadSolutionFactory");
        const undeadSolutionCreate2Factory = (await UndeadSolutionCreate2Factory.deploy()) as UndeadSolutionFactory;

        const [salt, address] = findSaltToMatch(hre, undeadSolutionCreate2Factory.address, minimalUndeadCode, "b100d");

        if (!salt || !address) {
            throw new Error("Could not find a salt to match the address");
        }

        console.log(`Found salt: ${salt}`);
        console.log(`Found address: ${address}`);

        await undeadSolutionCreate2Factory.deploy(minimalUndeadCode, salt);

        const undeadSolutionAddress = await undeadSolutionCreate2Factory.latestDeploy();

        console.log(`Deployed UndeadSolution at address: ${undeadSolutionAddress}`);

        const UndeadChallengeFactory = await hre.ethers.getContractFactory("undead");
        const undeadChallenge = (await UndeadChallengeFactory.attach(args.undeadAddress)) as Undead;

        console.log(`Attempting hack...`);
        const tx = await undeadChallenge.deadOrAlive(undeadSolutionAddress);

        await tx.wait();

        const id = hre.ethers.utils.solidityKeccak256(["address"], [undeadSolutionAddress]);
        console.log(`Calculated address id: ${id}`);

        const isPwnd = await undeadChallenge.UnDeAD(id);
        if (isPwnd) {
            console.log("Challenge solved!");
        } else {
            console.log("Challenge not solved!");
        }
    });
