/**
 * Plug Wallet Integration for ICP Contributions
 *
 * This hook provides a clean interface for making ICP contributions using the Plug wallet extension.
 *
 * Prerequisites:
 * 1. User must have the Plug wallet extension installed
 * 2. User must have ICP balance in their Plug wallet
 *
 * Usage:
 * ```tsx
 * const { mutate: contribute, isPending } = useContribute(1); // 1 ICP
 *
 * <Button onClick={() => contribute()}>
 *   Contribute 1 ICP
 * </Button>
 * ```
 *
 * Features:
 * - Automatic Plug wallet detection
 * - Connection request handling
 * - Amount conversion to e8s (8 decimal places)
 * - Success/error toast notifications
 * - Loading states
 *
 * @param amount - Amount in ICP (will be converted to e8s automatically)
 * @returns useMutation hook for contribution functionality
 */

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// TypeScript declarations for Plug wallet
declare global {
  interface Window {
    ic?: {
      plug?: {
        requestConnect: () => Promise<boolean>;
        requestTransfer: (params: {
          to: string;
          amount: number;
          memo?: string;
        }) => Promise<{ height: number }>;
        agent?: any;
        createActor?: (params: {
          canisterId: string;
          interfaceFactory: any;
        }) => any;
      };
    };
  }
}

export function useContribute(amount: number) {
  return useMutation({
    mutationFn: async () => {
      // Check if Plug is available
      if (!window?.ic?.plug) {
        throw new Error("Plug wallet extension not detected!");
      }

      // Request connection first
      const isConnected = await window.ic.plug.requestConnect();
      if (!isConnected) {
        throw new Error("Plug wallet connection was refused");
      }

      // Convert amount to e8s (8 decimal places)
      const e8sAmount = Math.floor(amount * 100000000);

      // Request transfer
      const transferParams = {
        to: "4ppas-bcjk7-pvvzg-uy6xp-7cblq-56to3-gryyo-7sjbq-5anil-7uufn-3ae", // Your destination address
        amount: e8sAmount,
        memo: "Contribution to group", // Optional memo
      };

      const result = await window.ic.plug.requestTransfer(transferParams);
      return result;
    },
    onSuccess: (result) => {
      toast.success(`Contribution successful! Block height: ${result.height}`);
    },
    onError: (error: Error) => {
      toast.error(`Contribution failed: ${error.message}`);
    },
  });
}

// Legacy function for backward compatibility
export async function requestTransfer(
  amount: number,
  agent: any
): Promise<boolean> {
  console.warn(
    "requestTransfer is deprecated. Use useContribute hook instead."
  );
  return false;
}

// Legacy function for backward compatibility
export async function sendICP(e8s: number) {
  console.warn("sendICP is deprecated. Use useContribute hook instead.");

  if (!window?.ic?.plug) {
    console.error("Plug wallet extension not detected!");
    return;
  }

  try {
    const isConnected = await window.ic.plug.requestConnect();
    if (!isConnected) {
      console.error("Plug wallet connection was refused");
      return;
    }

    const transferParams = {
      to: "4ppas-bcjk7-pvvzg-uy6xp-7cblq-56to3-gryyo-7sjbq-5anil-7uufn-3ae",
      amount: e8s,
      memo: "Contribution to group",
    };

    const result = await window.ic.plug.requestTransfer(transferParams);
    console.log("Transfer successful:", result);
  } catch (error) {
    console.error("Transfer failed:", error);
  }
}
