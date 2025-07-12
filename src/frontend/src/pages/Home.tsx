import dummy from "../../assets/images/message.webp";
import { FaBrain, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import ShinyText from "../blocks/TextAnimations/ShinyText/ShinyText";
import TokenCard from "@/components/app/dashboard/TokenCard";
import useICPBalance from "../../hooks/useICPBalance";
import { DASHBOARD_TOKENS } from "../../types/tokens";

export default function Home() {
  const { balance } = useICPBalance();

  return (
    <div className="md:mx-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-start gap-2 my-2">
          <img src={dummy} alt="user" className="w-16 h-16 rounded-full" />
          <div className="flex flex-col">
            <h1 className="font-karla-bold text-sm text-gray-400">
              Welcome Back
            </h1>
            <p className="text-primary text-lg font-karla flex items-center gap-2">
              Sylus Abel
              <span className="text-sm text-[#faf9f6] bg-[#e8492a] rounded-full px-2 py-.5">
                PRO
              </span>
            </p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, y: 100 }}
          className="flex items-center justify-end gap-2 px-4 my-2 flex-col border-[1px] cursor-pointer border-[#e8492a] rounded-2xl p-2"
        >
          <FaBrain size={20} className="text-primary" />
          <ShinyText
            text="Get AI Brief"
            disabled={false}
            speed={3}
            className="text-sm font-karla animate-shine text-primary"
          />
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-8">
        {DASHBOARD_TOKENS.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>
    </div>
  );
}
