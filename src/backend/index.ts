/**SERVICES */

import { MessagesService } from "./chat";
import { UserService } from "./user";
import { GroupChatService } from "./rooms";
import { IDL, query, update } from "azle";

const SupportedStandard = IDL.Record({
  url: IDL.Text,
  name: IDL.Text,
});

export const icrc10_supported_standards = query(
  [],
  IDL.Vec(SupportedStandard),
  () => {
    return [
      {
        url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-10/ICRC-10.md",
        name: "ICRC-10",
      },
      {
        url: "https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_28_trusted_origins.md",
        name: "ICRC-28",
      },
    ];
  }
);

const Icrc28TrustedOriginsResponse = IDL.Record({
  trusted_origins: IDL.Vec(IDL.Text),
});

export const icrc28_trusted_origins = update(
  [],
  Icrc28TrustedOriginsResponse,
  () => {
    return {
      trusted_origins: [
        "http://127.0.0.1:5173",
        "https://your-frontend-canister-id.icp0.io",
        "https://your-frontend-canister-id.raw.icp0.io",
        "https://your-frontend-canister-id.ic0.app",
        "https://your-frontend-canister-id.raw.ic0.app",
        "https://your-frontend-canister-id.icp0.icp-api.io",
        "https://your-frontend-canister-id.icp-api.io",
        "https://yourcustomdomain.com",
        "https://yourothercustomdomain.com",
      ],
    };
  }
);

/**INDEX CANISTER CLASS */
export default [UserService, MessagesService, GroupChatService];
