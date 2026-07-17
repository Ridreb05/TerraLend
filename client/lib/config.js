// Central configuration for the TerraLend dApp.
// Override the contract address via NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local.

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000"; // <-- Replace with your deployed address.

// Linea Sepolia testnet.
export const CHAIN = {
  id: 59141,
  hexId: "0xe705",
  name: "Linea Sepolia",
  rpcUrl: "https://rpc.sepolia.linea.build",
  explorerUrl: "https://sepolia.lineascan.build",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
};

// Funding models, mirroring the FundingModel enum in the smart contract.
export const FUNDING_MODEL = {
  GRANT: "Grant",
  GREEN_LOAN: "Green Loan",
};

// Maps the on-chain enum index to a human label.
export const modelFromIndex = (index) =>
  Number(index) === 1 ? FUNDING_MODEL.GREEN_LOAN : FUNDING_MODEL.GRANT;

// Maps a label back to the on-chain enum index.
export const indexFromModel = (label) =>
  label === FUNDING_MODEL.GREEN_LOAN ? 1 : 0;
