import React from "react";
import usePools from "../../../../hooks/usePools";
import ckBTC from "../../../../assets/icons/ckBTC.svg";
import icp from "../../../../assets/icons/icp.svg";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
function TrendingPools() {
  const { pools, loading, error } = usePools();
  //   console.log(pools[0]);
  return (
    <div className="flex flex-col gap-4 mt-4 items-center">
      <motion.div
        className="bg-[#faf6f6] rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center -gap-2">
            <img src={ckBTC} alt="ckBTC" className="w-10 h-10 " />
            <img
              src={icp}
              alt="icp"
              className="w-10 h-10 ml-[-20px] rounded-full bg-white border-[1px] border-gray-200"
            />
          </div>
          <div className="bg-[#171717] rounded-full px-4 py-1">
            <p className="text-white text-sm font-karla">Normal Pool</p>
          </div>
        </motion.div>
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-primary text-3xl font-karla flex items-center gap-2 my-6">
            ckBTC <ArrowRight className="w-4 h-4" /> ICP
          </h1>
          <p className="text-muted-foreground text-sm font-karla">
            The ckBTC/ICP pool on ICPSwap is a liquidity pool that allows users
            to trade ckBTC and ICP tokens. ckBTC, a tokenized version of Bitcoin
            on the Internet Computer, is backed 1:1 by Bitcoin and offers fast
            and cheap transactions compared to traditional Bitcoin transactions.
          </p>
        </motion.div>

        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="flex flex-col">
            <h1 className="text-gray-500 font-karla text-sm">TVL</h1>
            <p className="text-primary text-lg font-karla-bold">$360.07K</p>
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-500 font-karla text-sm">Fees</h1>
            <p className="text-primary text-lg font-karla-bold">$501.39</p>
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-500 font-karla text-sm">APR(24H)</h1>
            <p className="text-primary text-lg font-karla-bold">40.39%</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 gap-2">
          <Button
            className="bg-primary text-white px-4 py-2 rounded-2xl w-1/2 md:w-1/3"
            onClick={() => {
              window.open(
                "https://app.icpswap.com/liquidity/add/ryjl3-tyaaa-aaaaa-aaaba-cai/mxzaz-hqaaa-aaaar-qaada-cai/3000",
                "_blank"
              );
            }}
          >
            <p className="text-white text-sm font-karla">Add Liquidity</p>
          </Button>
          <Button
            className="bg-[#e8492a] text-white px-4 py-2 rounded-2xl w-1/2 md:w-1/3"
            onClick={() => {
              window.open(
                "https://app.icpswap.com/info-swap/pool/details/xmiu5-jqaaa-aaaag-qbz7q-cai?path=L2xpcXVpZGl0eT90YWI9VG9wUG9vbHM=&label=TGlxdWlkaXR5",
                "_blank"
              );
            }}
          >
            <p className="text-white text-sm font-karla">View Pool</p>
          </Button>
        </div>
      </motion.div>
      <h1 className="text-gray-500 text-sm font-karla text-center flex gap-1 items-center cursor-pointer hover:text-primary hover:underline transition-all duration-300 mt-4">
        View more pools
        <ExternalLink className="w-4 h-4" />
      </h1>
    </div>
  );
}

export default TrendingPools;
