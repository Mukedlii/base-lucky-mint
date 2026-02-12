import { ethers } from "hardhat";

const PAYOUT = "0xa782922Ff9c54F4264FD049189eC66940f528Eb0";

async function main() {
  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error(
      [
        "No deployer account available.",
        "\n\nFix:",
        "- In packages/contracts create .env (copy from .env.example)",
        "- Set DEPLOYER_PRIVATE_KEY to a 0x-prefixed 64-hex private key",
        "- Make sure that wallet has a little ETH on Base for gas",
      ].join("\n")
    );
  }

  const deployer = signers[0];
  console.log("Deployer:", await deployer.getAddress());

  const Factory = await ethers.getContractFactory("BaseLuckyLotto");
  const contract = await Factory.deploy(PAYOUT);
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("BaseLuckyLotto deployed to:", addr);
  console.log("MAX_SUPPLY:", (await contract.MAX_SUPPLY()).toString());
  console.log("MINT_PRICE:", (await contract.MINT_PRICE()).toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
