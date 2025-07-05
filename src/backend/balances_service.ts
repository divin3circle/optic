import { call, IDL, init, Principal, query, update, msgCaller } from "azle";
import {
  BITCOIN_API_CYCLE_COST,
  getCkBtcPrincipal,
  getMinterPrincipal,
} from "./utils";
import {
  bitcoin_get_balance_args,
  bitcoin_get_balance_result,
  bitcoin_get_utxos_args,
  bitcoin_get_utxos_result,
} from "azle/canisters/management/idl";
import { UpdateBalanceArgs, UpdateBalanceResult } from "./minterTypes";
import { Account } from "azle/canisters/icrc_1/idl";

export class BalancesService {
  /************
   * BALANCES FUNCTIONS
   * **********
   */

  /**
   * Get the balance of a Bitcoin address.
   * @param address - The Bitcoin address to get the balance of.
   * @returns The balance of the Bitcoin address.
   */

  @update([IDL.Text], bitcoin_get_balance_result)
  async getBalance(address: string): Promise<bitcoin_get_balance_result> {
    return await call<[bitcoin_get_balance_args], bitcoin_get_balance_result>(
      "aaaaa-aa",
      "bitcoin_get_balance",
      {
        paramIdlTypes: [bitcoin_get_balance_args],
        returnIdlType: bitcoin_get_balance_result,
        args: [
          {
            address,
            min_confirmations: [],
            network: { regtest: null },
          },
        ],
        cycles: BITCOIN_API_CYCLE_COST,
      }
    );
  }

  /**
   * Monitor the balance of a Bitcoin address.
   * @returns The balance of the Bitcoin address.
   */
  @update([IDL.Text], bitcoin_get_utxos_result)
  async getUtxos(address: string): Promise<bitcoin_get_utxos_result> {
    const result = await call<
      [bitcoin_get_utxos_args],
      bitcoin_get_utxos_result
    >("aaaaa-aa", "bitcoin_get_utxos", {
      paramIdlTypes: [bitcoin_get_utxos_args],
      returnIdlType: bitcoin_get_utxos_result,
      args: [
        {
          address,
          filter: [],
          network: { regtest: null },
        },
      ],
      cycles: BITCOIN_API_CYCLE_COST,
    });
    return result;
  }

  /**
   * Update user ckBTC balance
   * @returns The result of the update balance call.
   */

  @update([], UpdateBalanceResult)
  async updateBalance(): Promise<UpdateBalanceResult> {
    const updateBalanceResult: UpdateBalanceResult = await call<
      [UpdateBalanceArgs],
      UpdateBalanceResult
    >(getMinterPrincipal(), "update_balance", {
      paramIdlTypes: [UpdateBalanceArgs],
      returnIdlType: UpdateBalanceResult,
      args: [
        {
          owner: [msgCaller()],
          subaccount: [],
        },
      ],
    });

    return updateBalanceResult;
  }

  /**
   * Get the ckBTC balance of a user.
   * @returns The ckBTC balance of the user.
   */

  @update([], IDL.Nat64)
  async getCkBTCBalance(): Promise<bigint> {
    return await call<[Account], bigint>(
      getCkBtcPrincipal(),
      "icrc1_balance_of",
      {
        paramIdlTypes: [Account],
        returnIdlType: IDL.Nat,
        args: [
          {
            owner: msgCaller(),
            subaccount: [],
          },
        ],
      }
    );
  }
}
