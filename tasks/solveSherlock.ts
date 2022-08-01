import { BigNumber } from "ethers";
import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { Sherlock } from "../typechain";

function getArraySlot(hre: HardhatRuntimeEnvironment, slot: number, index: number = 0): BigNumber {
    const slotBN = BigNumber.from(slot);
    const zeroPaddedValue = hre.ethers.utils.hexZeroPad(slotBN.toHexString(), 32);
    const slotHashString = hre.ethers.utils.keccak256(zeroPaddedValue);
    return BigNumber.from(slotHashString).add(index);
}

function getMapSlot(
    hre: HardhatRuntimeEnvironment,
    slot: number,
    key: string,
    type: "value" | "variable" = "value",
): BigNumber {
    const paddedKey = type === "value" ? hre.ethers.utils.hexZeroPad(key, 32) : key;

    const slotBN = BigNumber.from(slot);
    const zeroPaddedValue = hre.ethers.utils.hexZeroPad(slotBN.toHexString(), 32);

    const concatKey = hre.ethers.utils.concat([paddedKey, zeroPaddedValue]);
    const slotHashString = hre.ethers.utils.keccak256(concatKey);
    return BigNumber.from(slotHashString);
}

task("solveSherlock", "Solves the Sherlock challenge")
    .addParam("sherlockAddress", "Address of the Sherlock contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (!hre.ethers.utils.isAddress(args.sherlockAddress)) {
            throw new Error(`Invalid contract address format: ${args.sherlockAddress}`);
        }

        const signers = await hre.ethers.getSigners();
        const signer = signers[0];

        const SherlockFactory = await hre.ethers.getContractFactory("sherlock", signer);
        const sherlockChallenge = (await SherlockFactory.attach(args.sherlockAddress)) as Sherlock;

        /**
            // Slots assignation for each storage variable in the `sherlock` contract

            // Slot 0
            uint256 public var256_1 = 1337;

            // Slot 1: 3 bools, 2 uint16 and 1 address (20 bytes)
            bool public bool_1 = false;
            bool public bool_2 = false;
            bool public bool_3 = true;
            uint16 public var16_1 = 32;
            uint16 private var16_2 = 64;
            address public contractAdd = address(this)
        
            // Slot 2
            uint256 private var256_2 = 3445;
            // Slot 3
            uint256 private var256_3 = 6677;
            // Slot 4
            bytes32 private iGotThePassword;
            // Slot 5
            bytes32 private actuallPass;
            // Slot 6
            bytes32 private definitelyThePass;
            // Slot 7
            uint256 public var256_4 = 7788;
        
            // Slot 8: 2 uint16, 3 bools, 1 address (20 bytes) + another uint16
            uint16 public var16_3 = 69;
            uint16 private var16_4 = 7;
            bool private _Pass = true;
            bool private _The = true;
            bool private _Password = false;
            address private owner;
            uint16 private counter;
        
            // This is a constant, so it is not stored in the storage
            bytes32 public constant thePassword = ...................[REDACTED]...................
        
            // This is a constant, so it is not stored in the storage
            bytes32 private constant ohNoNoNoNoNo = .................[REDACTED]...................
        
            // Slot 9-12: a static array occupies contiguous slots in storage
            bytes32[4] private passHashes;

            struct Passwords {
                bytes32 name;
                uint256 secretKey;
                bytes32 password;
            }
        
            // Slot 13: a dynamic array first slot is equal to keccak256(p), where `p` is the
            // slot number of the array variable. In this case the variable `passwords` occupies
            // the slot 13, and thus the first element of the array is stored at `keccak256(13)`
            //
            // Each consecutive element is located at `keccak256(13) + i` where `i` is the index
            //
            Passwords[] private passwords;
        
            // Slot 14: a mapping uses a different way to store the data. For this case, in which the
            // key is `uint256`, the value is stored at:
            //   `keccak256(keccak256(key) . 0x0000000000000000000000000000000000000000000000000000000000000014)
            //
            // where `.` is the concatenation operator.
            mapping(uint256 => Passwords) private destiny;
        */

        console.log(`------------------------------------------------------`);
        console.log(`Storage slot 0-12 contents (storage variables):`);
        console.log(`------------------------------------------------------`);
        for (let i = 0; i < 13; i++) {
            const slotContents = await hre.ethers.provider.getStorageAt(sherlockChallenge.address, i);

            console.log(` - Slot ${i}: ${slotContents}`);
        }

        console.log(`------------------------------------------------------`);
        console.log(`Storage slot 13 contents (passwords dynamic array):`);
        console.log(`------------------------------------------------------`);

        const numElementsBN = await hre.ethers.provider.getStorageAt(sherlockChallenge.address, 13);
        const numElements = BigNumber.from(numElementsBN).toNumber();
        const slot13Hash = getArraySlot(hre, 13);

        // The Passwords structure has the following layout:
        //   - bytes32 name
        //   - uint256 secretKey
        //   - bytes32 password
        //
        // So each element occupies 3 slots
        const PasswordsStructSize = 3;

        for (let i = 0; i < numElements * PasswordsStructSize; i += PasswordsStructSize) {
            const name = await hre.ethers.provider.getStorageAt(sherlockChallenge.address, slot13Hash.add(i));
            const secretKey = await hre.ethers.provider.getStorageAt(sherlockChallenge.address, slot13Hash.add(i + 1));
            const password = await hre.ethers.provider.getStorageAt(sherlockChallenge.address, slot13Hash.add(i + 2));

            console.log(`- Passwords[${i / 3}]:`);
            console.log(`    name: ${hre.ethers.utils.toUtf8String(name)}`);
            console.log(`    secretKey: ${secretKey}`);
            console.log(`    password: ${password}`);
        }

        console.log(`------------------------------------------------------`);
        console.log(`Storage slot 14 contents (destiny mapping):`);
        console.log(`------------------------------------------------------`);

        console.log(`- destiny[0]:`);
        const destiny0Slot = getMapSlot(hre, 14, "0x0000000000000000000000000000000000000000000000000000000000000001");
        const name = await hre.ethers.provider.getStorageAt(sherlockChallenge.address, destiny0Slot);
        const secretKey = await hre.ethers.provider.getStorageAt(sherlockChallenge.address, destiny0Slot.add(1));
        const password = await hre.ethers.provider.getStorageAt(sherlockChallenge.address, destiny0Slot.add(2));

        console.log(`    name: ${hre.ethers.utils.toUtf8String(name)}`);
        console.log(`    secretKey: ${secretKey}`);
        console.log(`    password: ${password}`);

        console.log(`\nThe password you are looking for is: ${password}`);
    });
