import { IDL } from "@dfinity/candid";

export const idlFactory = ({ IDL }) => {
  const PublicPoolOverView = IDL.Record({
    id: IDL.Nat,
    token0TotalVolume: IDL.Float64,
    volumeUSD1d: IDL.Float64,
    volumeUSD7d: IDL.Float64,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    token1Volume24H: IDL.Float64,
    totalVolumeUSD: IDL.Float64,
    sqrtPrice: IDL.Float64,
    pool: IDL.Text,
    tick: IDL.Int,
    liquidity: IDL.Nat,
    token1Price: IDL.Float64,
    feeTier: IDL.Nat,
    token1TotalVolume: IDL.Float64,
    volumeUSD: IDL.Float64,
    feesUSD: IDL.Float64,
    token0Volume24H: IDL.Float64,
    token1Standard: IDL.Text,
    txCount: IDL.Nat,
    token1Decimals: IDL.Float64,
    token0Standard: IDL.Text,
    token0Symbol: IDL.Text,
    token0Decimals: IDL.Float64,
    token0Price: IDL.Float64,
    token1Symbol: IDL.Text,
  });

  return IDL.Service({
    getAllPools: IDL.Func([], [IDL.Vec(PublicPoolOverView)], ["query"]),
    poolStorage: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ["query"]),
  });
};
