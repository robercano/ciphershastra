import { Contract } from "ethers";
import { deploy, DeploymentFlags } from "./utils/deployment";

/**
 * Deploy SimpleContract
 */
async function main() {
    const SimpleContract: Contract = await deploy("SimpleContract", [], DeploymentFlags.All);
    console.log(`SimpleContract deployed at ${SimpleContract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
