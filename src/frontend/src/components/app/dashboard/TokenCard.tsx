import { Token } from "../../../../types/tokens";
import useTokenBalance, {
  formatDecimals,
} from "../../../../hooks/useTokenBalance";
import useTokenPrices from "../../../../hooks/useTokenPrices";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";

function TokenCard({ token }: { token: Token }) {
  const { balanceData, loading } = useTokenBalance(token.ledgerId);
  const { price, loading: priceLoading } = useTokenPrices(token.name);

  return (
    <motion.div
      className="bg-[#faf9f6] h-[200px] rounded-4xl p-4 border border-gray-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="">
        <img src={token.icon} alt="token" className="w-10 h-10 rounded-full" />
        <h1 className="text-gray-500 mt-2 font-karla">{token.name}</h1>
      </div>
      <div className="">
        {priceLoading ? (
          <Skeleton className="w-20 h-4 bg-gray-300" />
        ) : (
          <h1 className="text-primary mt-2 font-karla">
            ${(price * formatDecimals(balanceData, token.name)).toFixed(2)}
          </h1>
        )}

        {loading ? (
          <Skeleton className="w-20 h-2 bg-gray-300 mt-1" />
        ) : (
          <p className="text-gray-500 font-karla text-sm">
            {formatDecimals(balanceData, token.name)} {token.symbol}
          </p>
        )}
      </div>
      <p className={`text-green-500 font-karla text-sm`}>+1.23%</p>
    </motion.div>
  );
}

export default TokenCard;
