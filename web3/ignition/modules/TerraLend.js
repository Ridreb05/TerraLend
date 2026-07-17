// Hardhat Ignition deployment module for TerraLend.
// Docs: https://hardhat.org/ignition
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TerraLendModule", (m) => {
  const terraLend = m.contract("TerraLend");
  return { terraLend };
});
