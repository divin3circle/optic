import { useEffect, useState } from "react";

export default function useTokenPrices(tokenName: string) {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrice = async () => {
      if (tokenName === "ICS") {
        setPrice(0.00664);
        return;
      }
      setLoading(true);
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${getBinanceTokenName(
          tokenName
        )}USDT`
      );
      const data = await response.json();
      setPrice(data.price);
      setLoading(false);
    };
    fetchPrice();
  }, []);

  return { price, loading };
}

function getBinanceTokenName(tokenName: string): string {
  switch (tokenName) {
    case "ckBTC":
      return "BTC";
    case "ckETH":
      return "ETH";
    case "ckUSDC":
      return "USDC";
    case "ckLINK":
      return "LINK";
    case "ICS":
      return "ICS";
    case "ICP":
      return "ICP";
    default:
      return tokenName;
  }
}
