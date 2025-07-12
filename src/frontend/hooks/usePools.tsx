import { HttpAgent, Actor } from "@dfinity/agent";
// @ts-ignore
import { idlFactory as nodeIndexIdlFactory } from "../utils/node_index.did.js";
import { useEffect, useState } from "react";

const NODE_INDEX_CANISTER_ID = "ggzvv-5qaaa-aaaag-qck7a-cai";

async function fetchAllPools(): Promise<any[]> {
  const agent = new HttpAgent({ host: "https://icp0.io" });

  const nodeIndexActor = Actor.createActor(nodeIndexIdlFactory, {
    agent,
    canisterId: NODE_INDEX_CANISTER_ID,
  });

  const pools = (await nodeIndexActor.getAllPools()) as any[];
  return pools;
}

export default function usePools() {
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const pools = await fetchAllPools();
        setPools(pools);
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
      setLoading(false);
    };
    fetchPools();
  }, []);

  return { pools, loading, error };
}
