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
 * - Detailed transaction logging for backend integration
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

// Transaction result interface
export interface ContributionResult {
  success: boolean;
  blockHeight?: number;
  amount: number;
  amountE8s: number;
  destination: string;
  memo?: string;
  timestamp: number;
  error?: string;
  groupId?: string;
  groupName?: string;
}

export function useContribute(amount: number) {
  return useMutation({
    mutationFn: async (): Promise<ContributionResult> => {
      const timestamp = Date.now();
      const amountE8s = Math.floor(amount * 100000000);
      const destination =
        "4ppas-bcjk7-pvvzg-uy6xp-7cblq-56to3-gryyo-7sjbq-5anil-7uufn-3ae";
      const memo = "Contribution to group";

      console.log("🚀 Starting ICP contribution:", {
        amount,
        amountE8s,
        destination,
        memo,
        timestamp: new Date(timestamp).toISOString(),
      });

      // Check if Plug is available
      if (!window?.ic?.plug) {
        const error = "Plug wallet extension not detected!";
        console.error("❌ Plug wallet error:", error);

        const result: ContributionResult = {
          success: false,
          amount,
          amountE8s,
          destination,
          memo,
          timestamp,
          error,
        };

        return result;
      }

      try {
        // Request connection first
        console.log("🔗 Requesting Plug wallet connection...");
        const isConnected = await window.ic.plug.requestConnect();

        if (!isConnected) {
          const error = "Plug wallet connection was refused";
          console.error("❌ Connection failed:", error);

          const result: ContributionResult = {
            success: false,
            amount,
            amountE8s,
            destination,
            memo,
            timestamp,
            error,
          };

          return result;
        }

        console.log("✅ Plug wallet connected successfully");

        // Request transfer
        const transferParams = {
          to: destination,
          amount: amountE8s,
          memo,
        };

        console.log("💰 Requesting transfer with params:", transferParams);
        const result = await window.ic.plug.requestTransfer(transferParams);

        console.log("✅ Transfer successful:", {
          blockHeight: result.height,
          amount,
          amountE8s,
          destination,
          memo,
          timestamp: new Date(timestamp).toISOString(),
        });

        const contributionResult: ContributionResult = {
          success: true,
          blockHeight: result.height,
          amount,
          amountE8s,
          destination,
          memo,
          timestamp,
        };

        return contributionResult;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("❌ Transfer failed:", {
          error: errorMessage,
          amount,
          amountE8s,
          destination,
          memo,
          timestamp: new Date(timestamp).toISOString(),
        });

        const result: ContributionResult = {
          success: false,
          amount,
          amountE8s,
          destination,
          memo,
          timestamp,
          error: errorMessage,
        };

        return result;
      }
    },
    onSuccess: (result: ContributionResult) => {
      if (result.success) {
        toast.success(
          `Contribution successful! Block height: ${result.blockHeight}`
        );
        console.log("🎉 Contribution completed successfully:", result);

        // TODO: Call your backend canister here with the result
        // Example:
        // await callBackendContribute({
        //   blockHeight: result.blockHeight,
        //   amount: result.amount,
        //   amountE8s: result.amountE8s,
        //   destination: result.destination,
        //   memo: result.memo,
        //   timestamp: result.timestamp,
        // });
      } else {
        toast.error(`Contribution failed: ${result.error}`);
        console.error("💥 Contribution failed:", result);
      }
    },
    onError: (error: Error) => {
      toast.error(`Contribution failed: ${error.message}`);
      console.error("💥 Unexpected error during contribution:", error);
    },
  });
}

// Helper function to call backend canister (you can implement this)
export async function callBackendContribute(
  contributionData: ContributionResult
) {
  try {
    console.log(
      "📞 Calling backend canister with contribution data:",
      contributionData
    );

    // TODO: Implement your backend canister call here
    // Example:
    // const response = await yourBackendActor.contribute_to_chat_room({
    //   group_chat_id: contributionData.groupId || "default-group-id",
    //   amount: contributionData.amountE8s,
    //   token: "ICP",
    //   contributor: userPrincipal, // You'll need to get this from your auth system
    //   blockHeight: contributionData.blockHeight,
    //   timestamp: contributionData.timestamp,
    // });

    // For now, we'll just log the data structure you can use
    console.log("📋 Backend canister call data structure:", {
      group_chat_id: contributionData.groupId,
      amount: contributionData.amountE8s,
      token: "ICP",
      contributor: "USER_PRINCIPAL_HERE", // Replace with actual user principal
      blockHeight: contributionData.blockHeight,
      timestamp: contributionData.timestamp,
      groupName: contributionData.groupName,
      memo: contributionData.memo,
      destination: contributionData.destination,
    });

    console.log("✅ Backend contribution logged successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to log contribution in backend:", error);
    return false;
  }
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
