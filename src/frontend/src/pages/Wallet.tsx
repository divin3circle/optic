import { PortfolioChart } from "@/components/app/dashboard/PortfolioChart";
import { Button } from "@/components/ui/button";
import React from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { DASHBOARD_TOKENS } from "../../types/tokens";
import TokenCard from "@/components/app/dashboard/TokenCard";

function Wallet() {
  return (
    <div>
      <h1 className="text-3xl font-karla-bold text-primary">Overview</h1>
      <div className="flex items-center flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <h1 className="text-gray-500 text-md font-karla">Portfolio</h1>
          <div className="bg-[#faf6f7] border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="">
                <h1 className="text-primary text-3xl font-karla-bold">$0</h1>
                <h1 className="text-gray-500 text-sm font-karla">
                  Portfolio Balance
                </h1>
              </div>
              <IoEllipsisVertical className="text-gray-500 text-sm cursor-pointer" />
            </div>
            <PortfolioChart />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-primary text-2xl mb-4 md:mb-8 font-karla-bold">
            Assets
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DASHBOARD_TOKENS.slice(0, 2).map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        </div>
      </div>
      <h1 className="text-primary text-2xl mt-8 mb-2 font-karla-bold">
        All Assets
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DASHBOARD_TOKENS.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>
    </div>
  );
}

export default Wallet;
