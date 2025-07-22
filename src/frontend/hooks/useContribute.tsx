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

const REQUEST_TRANSFER_TO =
  "4ppas-bcjk7-pvvzg-uy6xp-7cblq-56to3-gryyo-7sjbq-5anil-7uufn-3ae";
const MEMO = "Contribution to group";
const host = "https://icp-api.io";
const nnsCanisterId = "qoctq-giaaa-aaaaa-aaaea-cai";

// Whitelist
const whitelist = [nnsCanisterId];

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "../utils";
import useChatStore from "../store/chats";
import useUserStore from "../store/user";
import { Principal } from "@dfinity/principal";

// TypeScript declarations for Plug wallet
declare global {
  interface Window {
    ic?: {
      plug?: {
        requestConnect: (params: {
          whitelist: string[];
          host: string;
        }) => Promise<boolean>;
        requestTransfer: (params: {
          to: string;
          amount: number;
          memo: string;
        }) => Promise<{ height: number }>;
        agent?: any;
        createActor: (params: {
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

export async function checkPlugNetworkConfig() {
  try {
    console.log("🔍 Checking Plug network configuration...");

    if (!window?.ic?.plug) {
      console.error("❌ Plug wallet extension not detected!");
      return { available: false, error: "Plug not detected" };
    }

    console.log("📡 Attempting to connect to Plug...");

    const isConnected = await window.ic.plug.requestConnect({
      whitelist,
      host,
    });

    if (isConnected) {
      console.log("✅ Plug connection successful");
      console.log(
        "🌐 Network check completed - Plug appears to be configured correctly"
      );
      return { available: true, connected: true };
    } else {
      console.error("❌ Plug connection failed");
      return { available: true, connected: false, error: "Connection refused" };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Network check failed:", errorMessage);

    if (errorMessage.includes("localhost:5000")) {
      console.error("🚨 ISSUE: Plug is configured for local development!");
      console.error(
        "💡 SOLUTION: Switch Plug to mainnet in extension settings"
      );
    }

    return { available: true, connected: false, error: errorMessage };
  }
}

export function useContribute(amount: number) {
  const { selectedGroupChatId } = useChatStore();
  const { user } = useUserStore();
  return useMutation({
    mutationFn: async (): Promise<ContributionResult> => {
      if (!selectedGroupChatId || !user) {
        throw new Error("Group chat ID or user not found");
      }

      const timestamp = Date.now();
      const amountE8s = Math.floor(amount * 100000000);
      const destination = REQUEST_TRANSFER_TO;
      const memo = MEMO;

      console.log("🚀 Starting ICP contribution:", {
        amount,
        amountE8s,
        destination,
        memo,
        timestamp: new Date(timestamp).toISOString(),
      });

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
        console.log("🔗 Requesting Plug wallet connection...");
        console.log(
          "🌐 Current network check - Plug should connect to IC mainnet"
        );

        const isConnected = await window.ic.plug.requestConnect({
          whitelist,
          host,
        });

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

        console.error("❌ Transfer failed with detailed error:", {
          error: errorMessage,
          errorType:
            error instanceof Error ? error.constructor.name : typeof error,
          errorStack: error instanceof Error ? error.stack : undefined,
          amount,
          amountE8s,
          destination,
          memo,
          timestamp: new Date(timestamp).toISOString(),
        });

        if (
          errorMessage.includes("CORS") ||
          errorMessage.includes("localhost:5000")
        ) {
          console.error("🚨 NETWORK CONFIGURATION ISSUE DETECTED:");
          console.error("   - Plug is trying to connect to localhost:5000");
          console.error("   - This suggests wrong network configuration");
          console.error("   - Please check Plug's network settings");
          console.error(
            "   - Should be connecting to IC mainnet, not local development"
          );
        }

        if (
          errorMessage.includes("403") ||
          errorMessage.includes("Forbidden")
        ) {
          console.error("🚨 ACCESS DENIED ISSUE DETECTED:");
          console.error("   - Getting 403 Forbidden from localhost:5000");
          console.error(
            "   - This suggests Plug is configured for local development"
          );
          console.error("   - Please switch Plug to mainnet configuration");
        }

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
    onSuccess: async (result: ContributionResult) => {
      if (result.success) {
        toast.success(
          `Contribution successful! Block height: ${result.blockHeight}`
        );
        console.log("🎉 Contribution completed successfully:", result);

        // TODO: Call backend canister with the result
        const recorded = await backend.contribute_to_chat_room(
          selectedGroupChatId || "",
          BigInt(result.amountE8s),
          "ICP",
          Principal.fromText(user?.id || "")
        );

        if (recorded) {
          toast.success("Contribution recorded successfully");
        } else {
          toast.error("Contribution recording failed");
        }
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

export async function requestTransfer(
  amount: number,
  agent: any
): Promise<boolean> {
  console.warn(
    "requestTransfer is deprecated. Use useContribute hook instead."
  );
  return false;
}

export async function sendICP(e8s: number) {
  console.warn("sendICP is deprecated. Use useContribute hook instead.");

  if (!window?.ic?.plug) {
    console.error("Plug wallet extension not detected!");
    return;
  }

  try {
    const isConnected = await window.ic.plug.requestConnect({
      whitelist,
      host,
    });
    if (!isConnected) {
      console.error("Plug wallet connection was refused");
      return;
    }

    const transferParams = {
      to: REQUEST_TRANSFER_TO,
      amount: e8s,
      memo: MEMO,
    };

    const result = await window.ic.plug.requestTransfer(transferParams);
    console.log("Transfer successful:", result);
  } catch (error) {
    console.error("Transfer failed:", error);
  }
}
