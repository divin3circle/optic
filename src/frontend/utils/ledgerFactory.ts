import { IDL } from "@dfinity/candid";

export const ledgerFactory = (idl: any) => {
  const Tokens = idl.IDL.Record({
    e8s: idl.IDL.Nat64,
  });

  const TransferArgs = idl.IDL.Record({
    to: idl.IDL.Vec(idl.IDL.Nat8),
    fee: Tokens,
    memo: idl.IDL.Nat64,
    from_subaccount: idl.IDL.Opt(idl.IDL.Vec(idl.IDL.Nat8)),
    created_at_time: idl.IDL.Opt(
      idl.IDL.Record({
        timestamp_nanos: idl.IDL.Nat64,
      })
    ),
    amount: Tokens,
  });

  const TransferError_1 = idl.IDL.Variant({
    TxTooOld: idl.IDL.Record({
      allowed_window_nanos: idl.IDL.Nat64,
    }),
    BadFee: idl.IDL.Record({
      expected_fee: Tokens,
    }),
    TxDuplicate: idl.IDL.Record({
      duplicate_of: idl.IDL.Nat64,
    }),
    TxCreatedInFuture: idl.IDL.Null,
    InsufficientFunds: idl.IDL.Record({
      balance: Tokens,
    }),
  });

  const Result_6 = idl.IDL.Variant({
    Ok: idl.IDL.Nat64,
    Err: TransferError_1,
  });

  return idl.IDL.Service({
    transfer: idl.IDL.Func([TransferArgs], [Result_6], []),
  });
};
