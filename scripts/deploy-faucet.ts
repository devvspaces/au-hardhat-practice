import { ethers } from "hardhat";

async function main() {
  const Faucet = await ethers.deployContract("Faucet");

  await Faucet.waitForDeployment();

  console.log(
    `Faucet contract deployed to: ${Faucet.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
