"use client";

import { ethers } from "ethers";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import abi from "@/lib/abi";
import { CONTRACT_ADDRESS, CHAIN, modelFromIndex, indexFromModel } from "@/lib/config";
import { toUnixDeadline } from "@/utils/date";
import { useToast } from "@/context/ToastContext";

const TerraLendContext = createContext(null);

/** Normalize a raw getProjectById tuple into a friendly object. */
const parseProject = (tuple, id) => ({
  id: Number(id),
  steward: tuple[0],
  title: tuple[1],
  summary: tuple[2],
  target: ethers.formatEther(tuple[3]),
  repaymentAmount: ethers.formatEther(tuple[4]),
  deadlineUnix: Number(tuple[5]),
  amountRaised: ethers.formatEther(tuple[6]),
  model: modelFromIndex(tuple[7]),
  isRepaid: tuple[8],
  isWithdrawn: tuple[9],
});

export function TerraLendProvider({ children }) {
  const toast = useToast();

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false); // reads
  const [txPending, setTxPending] = useState(false); // wallet confirmations

  const isConnected = Boolean(account);
  const isCorrectNetwork = chainId === CHAIN.id;

  /** A read-only contract instance, or a signer-bound one when a signer is passed. */
  const getContract = useCallback((signerOrProvider) => {
    const readProvider =
      signerOrProvider ??
      (typeof window !== "undefined" && window.ethereum
        ? new ethers.BrowserProvider(window.ethereum)
        : new ethers.JsonRpcProvider(CHAIN.rpcUrl));
    return new ethers.Contract(CONTRACT_ADDRESS, abi, readProvider);
  }, []);

  const refreshProjects = useCallback(async () => {
    setLoading(true);
    try {
      const contract = getContract();
      const total = Number(await contract.getTotalProjects());
      const rows = [];
      for (let i = 0; i < total; i++) {
        const tuple = await contract.getProjectById(i);
        rows.push(parseProject(tuple, i));
      }
      setProjects(rows);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  }, [getContract]);

  const addNetwork = useCallback(async () => {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: CHAIN.hexId,
          chainName: CHAIN.name,
          rpcUrls: [CHAIN.rpcUrl],
          nativeCurrency: CHAIN.nativeCurrency,
          blockExplorerUrls: [CHAIN.explorerUrl],
        },
      ],
    });
  }, []);

  const switchNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN.hexId }],
      });
    } catch (error) {
      if (error.code === 4902) await addNetwork();
      else throw error;
    }
  }, [addNetwork]);

  const syncAccount = useCallback(async (browserProvider, address) => {
    const bal = await browserProvider.getBalance(address);
    setBalance(ethers.formatEther(bal));
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast.error("MetaMask not found. Please install a Web3 wallet.");
      window?.open?.("https://metamask.io/download.html", "_blank");
      return;
    }
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const current = await window.ethereum.request({ method: "eth_chainId" });
      if (current !== CHAIN.hexId) await switchNetwork();

      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const network = await browserProvider.getNetwork();

      setProvider(browserProvider);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      await syncAccount(browserProvider, accounts[0]);
      toast.success("Wallet connected");
    } catch (error) {
      console.error("Wallet connection failed:", error);
      toast.error("Could not connect wallet.");
    }
  }, [switchNetwork, syncAccount, toast]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setBalance("0");
    setChainId(null);
    setProvider(null);
  }, []);

  /** Shared write-transaction runner with unified toast + pending state. */
  const runTx = useCallback(
    async (label, fn) => {
      if (!provider) {
        toast.error("Connect your wallet first.");
        return false;
      }
      setTxPending(true);
      try {
        const signer = await provider.getSigner();
        const contract = getContract(signer);
        const tx = await fn(contract);
        await tx.wait();
        toast.success(`${label} confirmed`);
        return true;
      } catch (error) {
        console.error(`${label} failed:`, error);
        const reason = error?.reason || error?.shortMessage || "Transaction failed";
        toast.error(reason);
        return false;
      } finally {
        setTxPending(false);
      }
    },
    [provider, getContract, toast]
  );

  const createProject = useCallback(
    async (form) => {
      const ok = await runTx("Project creation", (contract) =>
        contract.createProject(
          account,
          form.title,
          form.summary,
          ethers.parseEther(form.target),
          form.model === "Green Loan" ? ethers.parseEther(form.repaymentAmount) : 0,
          toUnixDeadline(form.deadline),
          indexFromModel(form.model)
        )
      );
      if (ok) await refreshProjects();
      return ok;
    },
    [runTx, account, refreshProjects]
  );

  const fundProject = useCallback(
    (id, amountEth) =>
      runTx("Contribution", (contract) =>
        contract.fundProject(id, { value: ethers.parseEther(amountEth) })
      ),
    [runTx]
  );

  const repayLoan = useCallback(
    (id, amountEth) =>
      runTx("Repayment", (contract) =>
        contract.repayLoan(id, { value: ethers.parseEther(amountEth) })
      ),
    [runTx]
  );

  const withdrawFunds = useCallback(
    (id) => runTx("Withdrawal", (contract) => contract.withdrawFunds(id)),
    [runTx]
  );

  const getProjectById = useCallback(
    async (id) => {
      const contract = getContract();
      const tuple = await contract.getProjectById(id);
      return parseProject(tuple, id);
    },
    [getContract]
  );

  const getBackers = useCallback(
    async (id) => {
      try {
        const contract = getContract();
        const [backers, contributions] = await contract.getBackers(id);
        return backers.map((address, i) => ({
          address,
          amount: ethers.formatEther(contributions[i]),
        }));
      } catch (error) {
        console.error("Failed to fetch backers:", error);
        return [];
      }
    },
    [getContract]
  );

  const getRemainingAmount = useCallback(
    async (id) => {
      const contract = getContract();
      const remaining = await contract.getRemainingAmount(id);
      return ethers.formatEther(remaining);
    },
    [getContract]
  );

  // Initial load.
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  // React to wallet account/chain changes.
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;
    const handleAccounts = (accounts) => {
      if (accounts.length === 0) disconnectWallet();
      else setAccount(accounts[0]);
    };
    const handleChain = () => window.location.reload();
    window.ethereum.on("accountsChanged", handleAccounts);
    window.ethereum.on("chainChanged", handleChain);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccounts);
      window.ethereum.removeListener("chainChanged", handleChain);
    };
  }, [disconnectWallet]);

  const value = {
    account,
    balance,
    chainId,
    isConnected,
    isCorrectNetwork,
    loading,
    txPending,
    projects,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshProjects,
    createProject,
    fundProject,
    repayLoan,
    withdrawFunds,
    getProjectById,
    getBackers,
    getRemainingAmount,
  };

  return (
    <TerraLendContext.Provider value={value}>
      {children}
    </TerraLendContext.Provider>
  );
}

export const useTerraLend = () => {
  const ctx = useContext(TerraLendContext);
  if (!ctx) throw new Error("useTerraLend must be used within a TerraLendProvider");
  return ctx;
};
