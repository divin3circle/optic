import { motion } from "framer-motion";
import logo from "../../../assets/images/icon.png";
import { useNavigate } from "react-router-dom";
import {
  ConnectWallet,
  ConnectWalletButton,
  ConnectedWalletButton,
  ConnectWalletDropdownMenu,
} from "@nfid/identitykit/react";

const CustomConnectButton = (props: any) => (
  <button
    {...props}
    className="text-sm md:text-xl font-karla cursor-pointer text-gray-700 hover:text-[#e8492a] transition-all duration-300 hover:underline"
  >
    Internet Identity
  </button>
);

const CustomConnectedButton = (props: any) => (
  <ConnectedWalletButton
    {...props}
    style={{
      backgroundColor: "transparent",
      border: "1px solid #e8492a",
      padding: "0",
      margin: "0",
      fontSize: "16px",
      fontWeight: "normal",
      color: "black",
      fontFamily: "Karla",
    }}
    className="text-sm md:text-xl font-karla cursor-pointer text-gray-700 hover:text-[#e8492a] transition-all duration-300 hover:underline border border-gray-400 rounded-full px-4 py-2"
  >
    {props.children}
  </ConnectedWalletButton>
);

const CustomConnectWalletDropdownMenu = (props: any) => (
  <ConnectWalletDropdownMenu
    {...props}
    style={{
      backgroundColor: "#f6f6f6",
      fontFamily: "Karla",
      fontWeight: "normal",
      fontSize: "16px",
    }}
    className="border border-gray-400 rounded-full px-4 py-2 shadow-none"
  >
    {props.children}
  </ConnectWalletDropdownMenu>
);

function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-background">
      <a href="/">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, y: 100 }}
          className="flex items-center justify-center gap-2  p-2 rounded-3xl cursor-pointer"
        >
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h1 className="text-2xl font-karla-bold text-primary">Optic</h1>
        </motion.div>
      </a>
      <div className="flex items-center gap-4 px-4">
        <ConnectWallet
          connectButtonComponent={CustomConnectButton}
          connectedButtonComponent={CustomConnectedButton}
          dropdownMenuComponent={CustomConnectWalletDropdownMenu}
        />
      </div>
    </div>
  );
}

export default Navbar;
