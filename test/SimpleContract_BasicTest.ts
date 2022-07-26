import chai, { expect } from "chai";
import chaiEthersBN from "chai-ethers-bn";
import { ethers } from "hardhat";

import { SimpleContract } from "../typechain";

chai.use(chaiEthersBN());

describe("SimpleContract", function () {
    describe("Basic Cases", function () {
        let simpleContract: SimpleContract;

        // Initialize the contract
        beforeEach(async function () {
            const SimpleContract = await ethers.getContractFactory("SimpleContract");
            simpleContract = (await SimpleContract.deploy()) as SimpleContract;
            await simpleContract.deployed();
        });
        it("Valid deployment", async function () {
            await expect(await simpleContract.value()).to.be.a.bignumber.that.equals(0);
        });
        it("Increment", async function () {
            await simpleContract.increment();
            await expect(await simpleContract.value()).to.be.a.bignumber.that.equals(1);
            await simpleContract.increment();
            await expect(await simpleContract.value()).to.be.a.bignumber.that.equals(2);
            await simpleContract.increment();
            await expect(await simpleContract.value()).to.be.a.bignumber.that.equals(3);
        });
        it("IncrementBy", async function () {
            await simpleContract.incrementBy(8);
            await expect(await simpleContract.value()).to.be.a.bignumber.that.equals(8);
            await simpleContract.incrementBy(5);
            await expect(await simpleContract.value()).to.be.a.bignumber.that.equals(13);
            await simpleContract.incrementBy(9);
            await expect(await simpleContract.value()).to.be.a.bignumber.that.equals(22);
        });
    });
});
