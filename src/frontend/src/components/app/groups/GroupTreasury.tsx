import React from "react";
import useChatStore from "../../../../store/chats";
import { GroupEarningsGraph } from "./GroupEarningsGraph";

function GroupTreasury() {
  const { groupHeaderProps } = useChatStore();
  return (
    <div className="flex flex-col mt-4">
      <h1 className="text-xl text-primary font-karla-semi-bold">Treasury</h1>
      <div className="flex items-center justify-between my-2 border-b border-gray-200 pb-2">
        <div className="flex items-start flex-col justify-start">
          <h1 className="text-sm text-gray-600 font-karla">
            Total Contributions
          </h1>
          <p className="text-xs text-gray-500 font-karla">since October 2024</p>
        </div>
        <div className="flex items-end flex-col justify-end">
          <h1 className="text-lg text-gray-700 font-karla">$100,000.00</h1>
          <h1 className="text-sm text-gray-500 font-karla">2,000 ICP</h1>
        </div>
      </div>
      <div className="flex items-center justify-between my-2 border-b border-gray-200 pb-2">
        <div className="flex items-start flex-col justify-start">
          <h1 className="text-sm text-gray-600 font-karla">Total Earnings</h1>
          <p className="text-xs text-gray-500 font-karla">last 6 months</p>
        </div>
        <div className="flex items-end flex-col justify-end">
          <h1 className="text-lg text-gray-700 font-karla">$1,300</h1>
          <h1 className="text-sm text-gray-500 font-karla">200 ICP</h1>
        </div>
      </div>
      <div className="flex items-center justify-between my-2 border-b border-gray-200 pb-2">
        <div className="flex items-start flex-col justify-start">
          <h1 className="text-sm text-gray-600 font-karla">Total Investors</h1>
          <p className="text-xs text-gray-500 font-karla">
            On average investors are earning $1 per week.
          </p>
        </div>
        <div className="flex items-end flex-col justify-end">
          <h1 className="text-lg text-gray-700 font-karla">
            {groupHeaderProps?.investors.length}
          </h1>
        </div>
      </div>
      <GroupEarningsGraph />
    </div>
  );
}

export default GroupTreasury;
