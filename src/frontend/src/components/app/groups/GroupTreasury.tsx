import useChatStore from "../../../../store/chats";
import { DASHBOARD_TOKENS } from "../../../../types/tokens";

function GroupTreasury() {
  const { groupHeaderProps } = useChatStore();
  let findGroupContributionToken = DASHBOARD_TOKENS.find(
    (token) => token.name === groupHeaderProps?.treasury.token
  );
  if (!findGroupContributionToken) {
    findGroupContributionToken = DASHBOARD_TOKENS[0];
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
        <div className="flex items-end flex-col justify-end">
          <h1 className="text-lg text-gray-700 font-karla">$100,000.00</h1>
          <h1 className="text-sm text-gray-500 font-karla">2,000 ICP</h1>
        </div>
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
