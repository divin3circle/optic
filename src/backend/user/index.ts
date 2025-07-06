/**
 * *************************
 * ------------------------
 * User Service
 * ------------------------
 * *************************
 */

import { query, update, Principal, IDL, msgCaller } from "azle";
import { User, Notification, PersonalMessage, ChatRoom } from "../types";

export class UserService {
  /**
   * @description This is used to store all users in the system
   */
  users: Map<string, User> = new Map();

  /**
   * @description This is used to store all usernames in the system
   * avoiding duplicates
   */
  usernameSet: Set<string> = new Set();

  /**
   * @description This is used to get a user by their principal id
   * @returns User by principal id
   * @param principalId - The principal id of the user
   */
  @query([], IDL.Opt(User))
  get_user(principalId: Principal): User | null {
    return this.users.get(principalId.toString()) || null;
  }

  /**
   * @description This is used to get all users in the system
   * @returns All users in the system
   */
  @query([], IDL.Vec(User))
  get_all_users(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * @description Creates a new user in the system
   * @param user - The user to create
   */
  @update([User], IDL.Opt(User))
  create_user(user: User): User | null {
    if (this.users.has(user.principalId.toString())) {
      return null;
    }
    this.users.set(user.principalId.toString(), user);
    this.usernameSet.add(user.username);
    return user;
  }

  /**
   * @description Checks if a username exists in the system
   * @param username - The username to check
   * @returns True if the username exists, false otherwise
   */
  @query([], IDL.Bool)
  username_exists(username: string): boolean {
    return this.usernameSet.has(username);
  }

  /**
   * @description Updates a user in the system
   * @param user - The user to update
   * @returns The updated user
   */
  @update([User], IDL.Opt(User))
  update_user(user: User): User | null {
    if (!this.users.has(user.principalId.toString())) {
      return null;
    }
    this.users.set(user.principalId.toString(), user);
    return user;
  }

  /**
   * @description Deletes a user from the system
   * @param principalId - The principal id of the user to delete
   * @returns The deleted user
   */
  @update([], IDL.Opt(User))
  delete_user(principalId: Principal): User | null {
    const user = this.users.get(principalId.toString());
    if (!user) {
      return null;
    }
    this.users.delete(principalId.toString());
    this.usernameSet.delete(user.username);
    return user;
  }

  /**
   * @description Marks a notification as read
   * @param notificationId - The id of the notification to mark as read
   */
  @update([], IDL.Bool)
  mark_notification_read(notificationId: string): boolean {
    const caller = msgCaller();
    const user = this.users.get(caller.toString());
    if (!user) {
      return false;
    }
    const notification = user.notifications.find(
      (notification) => notification.notificationId === notificationId
    );
    if (!notification) {
      return false;
    }
    notification.read = true;
    return true;
  }

  /**
   * @description Gets all notifications for a user
   * @param principalId - The principal id of the user
   * @returns All notifications for the user
   */
  @query([], IDL.Vec(Notification))
  get_notifications(principalId: Principal): Notification[] {
    return this.users.get(principalId.toString())?.notifications || [];
  }

  /**
   * @description Gets all personal messages for a user
   * @param principalId - The principal id of the user
   * @returns All personal messages for the user
   */
  @query([], IDL.Vec(PersonalMessage))
  get_personal_messages(principalId: Principal): PersonalMessage[] {
    return this.users.get(principalId.toString())?.personalMessages || [];
  }

  /**
   * @description Gets all chat rooms for a user
   * @param principalId - The principal id of the user
   * @returns All chat rooms for the user
   */
  @query([], IDL.Vec(IDL.Text))
  get_chat_rooms(principalId: Principal): string[] {
    const user = this.users.get(principalId.toString());
    if (!user) {
      return [];
    }
    return user.chatRooms;
  }
}
