# TerraLend — Smart Contracts

Solidity contracts powering TerraLend, a decentralized crowdlending platform for
climate and impact projects, deployed on the **Linea Sepolia** testnet.

## Contract: `TerraLend.sol`

A single contract manages every project. Each project uses one of two funding models:

- **Grant** — a non-repayable impact contribution.
- **Green Loan** — repayable capital; on repayment, returns are distributed
  pro-rata to backers based on their share of the amount raised.

### Key functions

| Function | Description |
| --- | --- |
| `createProject(...)` | Launch a new Grant or Green Loan project. |
| `fundProject(id)` | Back a project with ETH (payable). |
| `repayLoan(id)` | Repay a Green Loan; distributes returns to backers. |
| `withdrawFunds(id)` | Steward withdraws raised funds (fully funded or past deadline). |
| `getProjectById(id)` | Read a single project. |
| `getProjects()` | Read all projects. |
| `getBackers(id)` | Read a project's backers and contributions. |

## Setup

```bash
cd web3
npm install
```

Create a `.env` file:

```bash
RPC_URL=https://rpc.sepolia.linea.build
PRIVATE_KEY=your_private_key_without_0x_prefix
LINEASCAN_API_KEY=optional_for_verification
```

## Commands

```bash
npm run compile   # Compile contracts
npm test          # Run the test suite
npm run deploy    # Deploy to Linea Sepolia
```

After deploying, copy the printed address into `client/.env.local` as
`NEXT_PUBLIC_CONTRACT_ADDRESS`.
