import { msgCaller, query } from "azle";
/**
 * Wallet Service
 * Stores user's ICP, ckBTC balances
 * Handles transfers, debit & credit functions
 * Manages user's identities(Internet Computer Identity)
 */

import { Principal } from "azle";

export class WalletService {
  private userPrincipal: Principal;
  private userIdentity: string;
  private userICPBalance: bigint = 0n;
  private userCkBTCBalance: bigint = 0n;
  private userBTCBalance: bigint = 0n;

  /**
   * Returns the caller's principal
   * @returns Principal
   */
  @query([], Principal)
  getMyPrincipal(): Principal {
    return msgCaller();
  }
}
