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

  @query([IDL.Principal], IDL.Opt(User))
  get_user(principalId: Principal): [User] | [] {
    const user = this.users.get(principalId.toString());
    return user ? [user] : [];
  }

  @query([], IDL.Vec(User))
  get_all_users(): User[] {
    return Array.from(this.users.values());
  }

  @update([User], IDL.Opt(User))
  create_user(user: User): [User] | [] {
    const caller = msgCaller();
    if (this.users.has(caller.toString())) {
      return [];
    }
    this.users.set(caller.toString(), user);
    this.usernameSet.add(user.username);
    return [user];
  }

  @query([IDL.Text], IDL.Bool)
  username_exists(username: string): boolean {
    return this.usernameSet.has(username);
  }

  @update([User], IDL.Opt(User))
  update_user(user: User): [User] | [] {
    const caller = msgCaller();
    if (!this.users.has(caller.toString())) {
      return [];
    }
    this.users.set(caller.toString(), user);
    return [user];
  }

  @update([], IDL.Opt(User))
  delete_user(): [User] | [] {
    const caller = msgCaller();
    const user = this.users.get(caller.toString());
    if (!user) {
      return [];
    }
    this.users.delete(caller.toString());
    this.usernameSet.delete(user.username);
    return [user];
  }

  @update([IDL.Text], IDL.Bool)
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
  get_notifications(): Notification[] {
    const caller = msgCaller();
    return this.users.get(caller.toString())?.notifications || [];
  }

  @query([], IDL.Vec(PersonalMessage))
  get_personal_messages(): PersonalMessage[] {
    const caller = msgCaller();
    return this.users.get(caller.toString())?.personalMessages || [];
  }

  @query([], IDL.Vec(IDL.Text))
  get_chat_rooms(): string[] {
    const caller = msgCaller();
    const user = this.users.get(caller.toString());
    if (!user) {
      return [];
    }
    return user.chatRooms;
  }
}
