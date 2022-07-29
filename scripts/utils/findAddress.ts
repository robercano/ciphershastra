import { BytesLike } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export enum PatternFlags {
    None,
    FromStart,
    FromEnd,
}

export function findSaltToMatch(
    hre: HardhatRuntimeEnvironment,
    from: string,
    bytecode: BytesLike,
    pattern: string,
    startingSalt: string = "0x0",
    flags: PatternFlags = PatternFlags.None,
): [string | undefined, string | undefined] {
    const initCodeHash = hre.ethers.utils.keccak256(bytecode);
    let salt = hre.ethers.BigNumber.from(startingSalt);
    let count = 0;

    const limit = hre.ethers.BigNumber.from(2).pow(256);
    while (salt.lt(limit)) {
        const saltString = salt.toHexString().slice(2).padStart(64, "0");

        const address = hre.ethers.utils
            .getCreate2Address(from, Buffer.from(saltString, "hex"), initCodeHash)
            .toLowerCase();

        //console.log(address);
        //console.log(salt.toHexString());

        switch (flags) {
            case PatternFlags.FromStart:
                if (address.startsWith("0x" + pattern)) {
                    return ["0x" + saltString, address];
                }
                break;
            case PatternFlags.FromEnd:
                if (address.endsWith(pattern)) {
                    return ["0x" + saltString, address];
                }
                break;
            default:
                if (address.indexOf(pattern) !== -1) {
                    return ["0x" + saltString, address];
                }
        }

        salt = salt.add(1);
        count++;

        if (count % 500000 === 0) {
            console.log(`Current salt: ${salt.toHexString()}`);
        }
    }

    return [undefined, undefined];
}
