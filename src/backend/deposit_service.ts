import { call, IDL, init, Principal, query, update, msgCaller } from "azle";
import { bitcoin_address } from "azle/canisters/management/idl";
import { getBtcAddressArgs, getBtcAddressResult, Position } from "./types";
import { getMinterPrincipal } from "./utils";

export class DepositService {
  /************
   * DEPOSIT STATES
   * **********
   */

  deposits: Map<Principal, string> = new Map();

  /**
   * A mapping of user principal to their
   * positions in various pools. Useful for
   * tracking user's positions and calculating
   * their rewards and app fees
   */

  positions: Map<Principal, Position[]> = new Map();

  /************
   * DEPOSIT FUNCTIONS
   * **********
   */

  /**
   * Create a deposit address for a user.
   * @returns The Bitcoin address of the user.
   */

  @update([], bitcoin_address)
  async createDepositAddress(): Promise<bitcoin_address> {
    const result = await getUserBtcDepositAddress(msgCaller().toString());
    this.deposits.set(msgCaller(), result);
    return result;
  }

  /**
   * Get all deposit addresses
   * @returns All deposit addresses and their corresponding user principal
   */

  @query(
    [],
    IDL.Vec(
      IDL.Record({
        address: IDL.Text,
        principal: IDL.Principal,
      })
    )
  )
  async getDepositAddresses(): Promise<
    {
      address: string;
      principal: Principal;
    }[]
  > {
    return Array.from(this.deposits.entries()).map(([principal, address]) => ({
      address,
      principal,
    }));
  }

  /**
   * Get all user positions and update the positions map
   * @notice This function is called by the user
   * @returns The positions of the user.
   */

  @update([], IDL.Vec(Position))
  async getAllUserPositions(): Promise<Position[]> {
    const caller = msgCaller();
    const positions = Array.from(this.positions.get(caller) ?? []);
    this.positions.set(caller, positions);
    return positions;
  }
}

async function getUserBtcDepositAddress(
  userPrincipal: string,
  subaccount?: Uint8Array
): Promise<string> {
  const args = {
    owner: Principal.fromText(userPrincipal),
    subaccount: subaccount ? [subaccount] : [],
  };

  const btcAddress = await call<[typeof args], string>(
    getMinterPrincipal(),
    "get_btc_address",
    {
      paramIdlTypes: [getBtcAddressArgs],
      returnIdlType: getBtcAddressResult,
      args: [args],
    }
  );

  return btcAddress;
}
