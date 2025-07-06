/**
 * *************************
 * ------------------------
 * User Service
 * ------------------------
 * *************************
 */

import { query, update, msgCaller, Principal, IDL } from "azle";
import { User } from "../types";

export class UserService {
  users: Map<string, User> = new Map();

  @query([], IDL.Opt(User))
  get_user(principalId: Principal): User | null {
    return this.users.get(principalId.toString()) || null;
  }
}
