import { Wallet, Rocket, HandCoins, Sprout } from "lucide-react";

const STEPS = [
  {
    Icon: Wallet,
    title: "Connect your wallet",
    body: "Link MetaMask on Linea Sepolia. No sign-ups, no middlemen — your wallet is your account.",
  },
  {
    Icon: Rocket,
    title: "Launch or discover",
    body: "Stewards publish a project as a grant or green loan. Backers browse and pick what to fund.",
  },
  {
    Icon: HandCoins,
    title: "Fund transparently",
    body: "Every contribution is an on-chain transaction. Progress toward the target updates in real time.",
  },
  {
    Icon: Sprout,
    title: "Grow & repay",
    body: "Green loans repay backers pro-rata on success. Grants power impact with zero repayment.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          How TerraLend works
        </h2>
        <p className="mt-4 text-muted-foreground">
          A transparent, four-step path from idea to impact — governed entirely
          by smart contracts.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ Icon, title, body }, i) => (
          <div
            key={title}
            className="group relative rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="absolute right-5 top-5 font-mono text-sm text-muted-foreground/50">
              0{i + 1}
            </span>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700 transition group-hover:bg-leaf-gradient group-hover:text-white dark:bg-leaf-500/15 dark:text-leaf-300">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
