const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TerraLend...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

  const TerraLend = await ethers.getContractFactory("TerraLend");
  const terraLend = await TerraLend.deploy();
  await terraLend.waitForDeployment();

  const address = await terraLend.getAddress();
  console.log("\n✅ TerraLend deployed to:", address);
  console.log("Add this to client/.env.local as NEXT_PUBLIC_CONTRACT_ADDRESS");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
