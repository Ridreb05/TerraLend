# 🌱 TerraLend

**Decentralized crowdlending platform for climate & impact projects.**

TerraLend connects climate builders with backers around the world. Anyone can
launch a project and raise funds two ways — as a **Grant** (non-repayable
impact contribution) or a **Green Loan** (repayable capital that returns funds to
backers pro-rata on repayment). Every contribution, repayment, and withdrawal is
a transparent transaction on the **Linea Sepolia** testnet.

> Fund the projects  regenerating our planet.

---

## ✨ Features

- **Two funding models** — Grants for pure impact, Green Loans for repayable capital with returns to backers.
- **On-chain transparency** — contributions, repayments, and withdrawals are all verifiable on Linea.
- **Pro-rata repayments** — when a Green Loan is repaid, each backer receives a share proportional to their contribution.
- **Powerful discovery** — search, filter (Grant / Green Loan / Active / Funded), and sort (newest, most funded, ending soon).
- **Steward dashboard actions** — withdraw raised funds and repay loans directly from a project page.
- **Modern Web3 UX** — wallet auto-detection, network switching, transaction toasts, pending-state overlays, skeletons, and empty states.
- **Responsive & accessible** — mobile-first layout, keyboard-friendly controls, ARIA labelling, and light/dark themes.

---

## 🧱 Tech Stack

| Layer | Technology |
| --- | --- |
| Smart contracts | Solidity `^0.8.27`, Hardhat |
| Network | Linea Sepolia (chainId `59141`) |
| Frontend | Next.js 14 (App Router), React 18 |
| Styling | Tailwind CSS, CSS variables, `tailwindcss-animate` |
| Web3 | ethers.js v6 |
| UI primitives | Radix UI, lucide-react, class-variance-authority |

---

## 📁 Folder Structure

```
TerraLend/
├── web3/                       # Hardhat smart-contract workspace
│   ├── contracts/
│   │   └── TerraLend.sol        # Core crowdlending contract
│   ├── scripts/deploy.js        # Deployment script
│   ├── ignition/modules/        # Hardhat Ignition module
│   ├── test/TerraLend.test.js   # Contract tests
│   └── hardhat.config.js
│
└── client/                     # Next.js frontend
    ├── app/
    │   ├── layout.js            # Root layout, providers, metadata
    │   ├── page.js              # Landing page
    │   ├── projects/            # Browse + [id] detail
    │   ├── create/              # Create-project flow
    │   ├── icon.svg             # Favicon
    │   └── globals.css          # Theme tokens & utilities
    ├── components/              # UI + feature components
    │   └── ui/                  # Reusable primitives (button, badge, dialog…)
    ├── context/                 # TerraLend, Theme, Toast providers
    ├── lib/                     # config, abi, formatting, cn helper
    ├── utils/                   # date helpers
    └── public/                  # logo, og image, illustrations
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Web3 wallet (e.g. MetaMask) on **Linea Sepolia**
- Some Linea Sepolia test ETH ([faucet](https://faucet.goerli.linea.build))

### 1. Smart contracts

```bash
cd web3
npm install
```

Create `web3/.env`:

```bash
RPC_URL=https://rpc.sepolia.linea.build
PRIVATE_KEY=your_private_key_without_0x_prefix
LINEASCAN_API_KEY=optional
```

Compile, test, and deploy:

```bash
npm run compile
npm test
npm run deploy      # prints the deployed contract address
```

### 2. Frontend

```bash
cd client
npm install
```

Create `client/.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Run it:

```bash
npm run dev         # http://localhost:3000
```

---

## 📜 Smart Contract Overview

`TerraLend.sol` manages every project through a single `Project` struct and a
`FundingModel` enum (`Grant`, `GreenLoan`).

| Function | Purpose |
| --- | --- |
| `createProject(...)` | Launch a Grant or Green Loan project. |
| `fundProject(id)` | Contribute ETH to a project (payable). |
| `repayLoan(id)` | Repay a Green Loan; distributes returns pro-rata to backers. |
| `withdrawFunds(id)` | Steward withdraws raised funds (fully funded, or after the deadline). |
| `getProjectById(id)` / `getProjects()` | Read project data. |
| `getBackers(id)` | Read a project's backers and contributions. |

Events (`ProjectCreated`, `ProjectFunded`, `LoanRepaid`, `FundsWithdrawn`) make
the full lifecycle indexable off-chain.

---

## 🌍 Deployment

The frontend is a standard Next.js app and deploys cleanly to **Vercel**:

1. Push the repo to GitHub.
2. Import `client/` as a Vercel project.
3. Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in the environment variables.
4. Deploy.

Contracts deploy to Linea Sepolia via `npm run deploy` in `web3/`.


