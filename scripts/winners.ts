import { ethers } from "hardhat";

require("dotenv").config();

async function main() {
  const provider = new ethers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_TESTNET_API_KEY
  );

  const signer = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, provider);

  const addr = "0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502";
  const abi = [
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "address", name: "", type: "address" },
      ],
      name: "Winner",
      type: "event",
    },
    {
      inputs: [] as any,
      name: "attempt",
      outputs: [] as any,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const winner = new ethers.Contract(addr, abi, signer);

  const code = await winner.attempt();
  console.log(code);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
