import { HoverEffect } from "../../ui/card-hover-effect";

export default function Features() {
  return (
    <div className="max-w-5xl mx-auto px-8 bg-background">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Fully On-Chain",
    description: "Real‑time group chat fully on‑chain without central servers",
    link: "https://stripe.com",
  },
  {
    title: "Shared Treasuries",
    description:
      "Trustless scheduled ICP or ckBTC pooling automates collective savings",
    link: "https://netflix.com",
  },
  {
    title: "ICP Swap",
    description:
      "Autonomous AI agents optimize pooled assets with transparent on‑chain actions",
    link: "https://google.com",
  },
  {
    title: "On-Chain Governance",
    description:
      "On‑chain governance enables collective strategy changes and fund withdrawals",
    link: "https://meta.com",
  },
  {
    title: "On-Chain Dashboard",
    description:
      "Interactive dashboards visualize balances, yields, and performance in real time",
    link: "https://amazon.com",
  },
  {
    title: "Canister Modules",
    description:
      "Modular canister plugins allow seamless expansion of platform capabilities",
    link: "https://microsoft.com",
  },
];
