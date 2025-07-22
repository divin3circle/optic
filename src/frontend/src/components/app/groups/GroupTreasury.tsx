import { data } from "react-router-dom";
import { useRoomInvestmentRecord } from "../../../../hooks/useRoomInvestementRecord";
import useChatStore from "../../../../store/chats";
import { DASHBOARD_TOKENS } from "../../../../types/tokens";
import { LoadingSmall } from "@/components/ui/Loading";
import useTokenPrices from "../../../../hooks/useTokenPrices";
import { format_token } from "../../../../utils/tokens";

function GroupTreasury() {
  const { groupHeaderProps } = useChatStore();
  const {
    data: roomInvestmentRecord,
    isLoading: isRoomInvestmentRecordLoading,
  } = useRoomInvestmentRecord();
  let findGroupContributionToken = DASHBOARD_TOKENS.find(
    (token) => token.name === groupHeaderProps?.treasury.token
  );
  const { price, loading } = useTokenPrices(
    format_token(groupHeaderProps?.treasury.token)
  );
  if (!findGroupContributionToken) {
    findGroupContributionToken = DASHBOARD_TOKENS[0];
  }
  if (!roomInvestmentRecord) {
    return null;
  }
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
        {isRoomInvestmentRecordLoading ? (
          <div className="flex flex-col justify-center items-center">
            <LoadingSmall />
          </div>
        ) : (
          <div className="flex items-end flex-col justify-end">
            <h1 className="text-lg text-gray-700 font-karla">
              {loading ? (
                <span className="text-gray-500 font-karla text-xs">
                  Loading...
                </span>
              ) : (
                `$${Number(roomInvestmentRecord.amount) * price}`
              )}
            </h1>
            <h1 className="text-sm text-gray-500 font-karla">
              {Number(roomInvestmentRecord.amount)} {roomInvestmentRecord.token}
            </h1>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between my-2 border-b border-gray-200 pb-2">
        <div className="flex items-start flex-col justify-start">
          <h1 className="text-sm text-gray-600 font-karla">Treasury Token</h1>
          <p className="text-xs text-gray-500 font-karla">
            Token used to contribute to the group
          </p>
        </div>
        <div className="flex items-end flex-col justify-end">
          <img
            src={findGroupContributionToken.icon}
            alt="Treasury Token"
            className="w-6 h-6"
          />
          <h1 className="text-sm text-gray-500 font-karla">
            {findGroupContributionToken.name}
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-between my-2 border-b border-gray-200 pb-2">
        <div className="flex items-start flex-col justify-start">
          <h1 className="text-sm text-gray-600 font-karla">Total Earnings</h1>
          <p className="text-xs text-gray-500 font-karla">last 6 months</p>
        </div>
        <div className="flex items-end flex-col justify-end">
          <h1 className="text-lg text-gray-700 font-karla">$0</h1>
          <h1 className="text-sm text-gray-500 font-karla">
            0 {groupHeaderProps?.treasury.token}
          </h1>
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
      <div className="flex items-center justify-between my-2 border-b border-gray-200 pb-2">
        <div className="flex items-start flex-col justify-start">
          <h1 className="text-sm text-gray-600 font-karla">Messages</h1>
          <p className="text-xs text-gray-500 font-karla">
            Canister Health: 100%
          </p>
        </div>
        <div className="flex items-end flex-col justify-end">
          <h1 className="text-lg text-gray-700 font-karla">
            {groupHeaderProps?.messages.length}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default GroupTreasury;
