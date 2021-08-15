import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners();
  const Event = await ethers.getContractFactory("Event");
  const Token = await ethers.getContractFactory("Token");

  const event = await Event.deploy();
  // const token = await Token.deploy();

  console.log("Event", event.address);
  // console.log("Token", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run --network matic scripts/deploy.ts
