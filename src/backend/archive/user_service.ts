import { call, IDL, init, Principal, query, update, msgCaller } from "azle";
import { Agent, User } from "./types";

export class UserService {
  /************
   * USER STATES
   * **********
   */

  /**
   * A mapping of user principal to their
   * user object.
   * Used to track user's information,
   * avoiding regenerating user objects for the same user.
   * @notice This is the main user object that is used to track
   * all user information.
   */

  users: Map<Principal, User> = new Map();

  /************
   * FUNCTIONS
   * **********
   */

  /**
   * Get caller's principal.
   * @returns The caller's principal.
   */

  @query([], IDL.Principal)
  async getCaller(): Promise<Principal> {
    return msgCaller();
  }

  /**
   * Create a user object for a user.
   * @param principal - The principal of the user.
   * @param username - The username of the user.
   * @param theme - The theme of the user.
   * @param agent - The agent of the user.
   */

  @update([IDL.Text, IDL.Text, IDL.Text, Agent], User)
  async createUser(
    principal: Principal,
    username: string,
    theme: "light" | "Dark",
    agent: Agent
  ): Promise<User> {
    const caller = msgCaller();
    const user: User = {
      principal: caller,
      username,
      theme,
      agent,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
    this.users.set(caller, user);
    return user;
  }
}
