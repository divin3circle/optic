// @ts-nocheck
import ckBTC from "../assets/icons/ckBTC.svg";
import ckETH from "../assets/icons/ckETH.svg";
import ckUSDC from "../assets/icons/ckUSDC.svg";
import ckLINK from "../assets/icons/ckLINK.svg";
import ICS from "../assets/icons/ICS.png";
import ICP from "../assets/icons/icp.svg";

export interface Token {
  id: string;
  name: string;
  ledgerId: string;
  symbol: string;
  icon: string;
}

export const DASHBOARD_TOKENS = [
  {
    id: "ckBTC",
    name: "ckBTC",
    symbol: "ckBTC",
    ledgerId: "mxzaz-hqaaa-aaaar-qaada-cai",
    icon: ckBTC,
  },
  {
    id: "ICP",
    name: "ICP",
    symbol: "ICP",
    ledgerId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    icon: ICP,
  },
  {
    id: "ckETH",
    name: "ckETH",
    symbol: "ckETH",
    ledgerId: "ss2fx-dyaaa-aaaar-qacoq-cai",
    icon: ckETH,
  },
  {
    id: "ckUSDC",
    name: "ckUSDC",
    symbol: "ckUSDC",
    ledgerId: "xevnm-gaaaa-aaaar-qafnq-cai",
    icon: ckUSDC,
  },
  {
    id: "ckLINK",
    name: "ckLINK",
    symbol: "ckLINK",
    ledgerId: "g4tto-rqaaa-aaaar-qageq-cai",
    icon: ckLINK,
  },
  {
    id: "ICS",
    name: "ICS",
    symbol: "ICS",
    ledgerId: "rh2pm-ryaaa-aaaan-qeniq-cai",
    icon: ICS,
  },
];
