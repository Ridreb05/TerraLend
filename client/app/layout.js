import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { TerraLendProvider } from "@/context/TerraLendContext";
import GlobalTxLoader from "@/components/GlobalTxLoader";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  metadataBase: new URL("https://terralend.xyz"),
  title: {
    default: "TerraLend — Crowdlending for Climate & Impact",
    template: "%s · TerraLend",
  },
  description:
    "TerraLend is a decentralized crowdlending platform for climate and impact projects. Fund grants or repayable green loans, transparently on-chain.",
  keywords: ["web3", "crowdlending", "climate", "DeFi", "Linea", "impact funding"],
  openGraph: {
    title: "TerraLend — Crowdlending for Climate & Impact",
    description:
      "Fund the projects regenerating our planet. Grants & green loans, settled on-chain.",
    url: "https://terralend.xyz",
    siteName: "TerraLend",
    images: [{ url: "/og.svg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TerraLend — Crowdlending for Climate & Impact",
    description: "Fund the projects regenerating our planet.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <ThemeProvider>
          <ToastProvider>
            <TerraLendProvider>
              {children}
              <GlobalTxLoader />
            </TerraLendProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
