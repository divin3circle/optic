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
  users: Map<string, User> = new Map();

  usernameSet: Set<string> = new Set();

  @query([], IDL.Opt(User))
  get_user(principalId: Principal): User | null {
    return this.users.get(principalId.toString()) || null;
  }

  @query([], IDL.Vec(User))
  get_all_users(): User[] {
    return Array.from(this.users.values());
  }

  @update([User], IDL.Opt(User))
  create_user(user: User): User | null {
    if (this.users.has(user.principalId.toString())) {
      return null;
    }
    this.users.set(user.principalId.toString(), user);
    this.usernameSet.add(user.username);
    return user;
  }

  @query([], IDL.Bool)
  username_exists(username: string): boolean {
    return this.usernameSet.has(username);
  }

  @update([User], IDL.Opt(User))
  update_user(user: User): User | null {
    if (!this.users.has(user.principalId.toString())) {
      return null;
    }
    this.users.set(user.principalId.toString(), user);
    return user;
  }

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

  @query([], IDL.Vec(Notification))
  get_notifications(principalId: Principal): Notification[] {
    return this.users.get(principalId.toString())?.notifications || [];
  }

  @query([], IDL.Vec(PersonalMessage))
  get_personal_messages(principalId: Principal): PersonalMessage[] {
    return this.users.get(principalId.toString())?.personalMessages || [];
  }

  @query([], IDL.Vec(IDL.Text))
  get_chat_rooms(principalId: Principal): string[] {
    const user = this.users.get(principalId.toString());
    if (!user) {
      return [];
    }
    return user.chatRooms;
  }
}
