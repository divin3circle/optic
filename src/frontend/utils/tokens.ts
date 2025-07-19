export async function get_conversion_rate(token: string): Promise<number> {
  const formattedToken = format_token(token);
  const price_url = `https://api.binance.com/api/v3/ticker/price?symbol=${formattedToken}USDT`;
  try {
    const response = await fetch(price_url);
    const data = await response.json();
    const price = parseFloat(data.price);
    return price;
  } catch (error) {
    console.log("Error fetching conversion rate", { error });
    return 1;
  }
}

export function format_token(token: string | undefined): string {
  if (!token) {
    return "ICP";
  }
  if (token.startsWith("ck")) {
    return token.slice(2);
  }
  return token;
}
