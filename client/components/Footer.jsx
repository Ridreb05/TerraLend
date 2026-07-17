import Link from "next/link";
import { Github, Twitter, Globe } from "lucide-react";
import Logo from "./Logo";
import { CHAIN } from "@/lib/config";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/projects", label: "Explore projects" },
      { href: "/create", label: "Start a project" },
      { href: "/#how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: CHAIN.explorerUrl, label: "Block explorer", external: true },
      { href: "https://metamask.io", label: "Get a wallet", external: true },
    ],
  },
];

const SOCIALS = [
  { href: "https://github.com", label: "GitHub", Icon: Github },
  { href: "https://twitter.com", label: "Twitter", Icon: Twitter },
  { href: "https://terralend.xyz", label: "Website", Icon: Globe },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Decentralized crowdlending for climate & impact. Fund the projects
            regenerating our planet — as grants or repayable green loans.
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-foreground">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-sm text-muted-foreground md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} TerraLend. Built on Linea.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-leaf-500" />
            {CHAIN.name} testnet
          </p>
        </div>
      </div>
    </footer>
  );
}
