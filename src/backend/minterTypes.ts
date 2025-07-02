import { IDL, Principal } from "azle";

const Utxo = IDL.Record({
  outpoint: IDL.Record({ txid: IDL.Vec(IDL.Nat8), vout: IDL.Nat32 }),
  value: IDL.Nat64,
  height: IDL.Nat32,
});
type Utxo = {
  outpoint: { txid: number[]; vout: number };
  value: bigint;
  height: number;
};

const UtxoStatus = IDL.Variant({
  ValueTooSmall: Utxo,
  Tainted: Utxo,
  Checked: Utxo,
  Minted: IDL.Record({
    block_index: IDL.Nat64,
    minted_amount: IDL.Nat64,
    utxo: Utxo,
  }),
});
type UtxoStatus =
  | { ValueTooSmall: Utxo }
  | { Tainted: Utxo }
  | { Checked: Utxo }
  | { Minted: { block_index: bigint; minted_amount: bigint; utxo: Utxo } };

const UpdateBalanceError = IDL.Variant({
  NoNewUtxos: IDL.Record({
    current_confirmations: IDL.Opt(IDL.Nat32),
    required_confirmations: IDL.Nat32,
  }),
  AlreadyProcessing: IDL.Null,
  TemporarilyUnavailable: IDL.Text,
  GenericError: IDL.Record({ error_message: IDL.Text, error_code: IDL.Nat64 }),
});
type UpdateBalanceError =
  | {
      NoNewUtxos: {
        current_confirmations?: number;
        required_confirmations: number;
      };
    }
  | { AlreadyProcessing: null }
  | { TemporarilyUnavailable: string }
  | { GenericError: { error_message: string; error_code: bigint } };

const UpdateBalanceResult = IDL.Variant({
  Ok: IDL.Vec(UtxoStatus),
  Err: UpdateBalanceError,
});
type UpdateBalanceResult = { Ok: UtxoStatus[] } | { Err: UpdateBalanceError };

const GetBtcAddressArgs = IDL.Record({
  owner: IDL.Opt(IDL.Principal),
  subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
});
type GetBtcAddressArgs = {
  owner: [Principal] | [];
  subaccount: [Uint8Array] | [];
};

const UpdateBalanceArgs = IDL.Record({
  owner: IDL.Opt(IDL.Principal),
  subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
});
type UpdateBalanceArgs = {
  owner: [Principal] | [];
  subaccount: [Uint8Array] | [];
};

const Minter = IDL.Service({
  get_btc_address: IDL.Func([GetBtcAddressArgs], [IDL.Text], []),
  update_balance: IDL.Func([UpdateBalanceArgs], [UpdateBalanceResult], []),
});

export {
  Utxo,
  UtxoStatus,
  UpdateBalanceError,
  UpdateBalanceResult,
  GetBtcAddressArgs,
  UpdateBalanceArgs,
  Minter,
};
