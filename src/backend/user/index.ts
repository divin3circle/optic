/**
 * *************************
 * ------------------------
 * User Service
 * ------------------------
 * *************************
 */

import { query, update, Principal, IDL, msgCaller } from "azle";
import {
  User,
  Notification,
  PersonalMessage,
  ChatRoom,
  PersonalChatRoom,
} from "../types";
import { users, username_set } from "../state";
import { log } from "../utils";

export class UserService {
  @query([IDL.Principal], IDL.Opt(User))
  get_user(principalId: Principal): [User] | [] {
    const user = users.get(principalId.toString());
    return user ? [user] : [];
  }

  @query([], IDL.Vec(User))
  get_all_users(): User[] {
    return Array.from(users.values());
  }

  @update([User], IDL.Opt(User))
  create_user(user: User): [User] | [] {
    const caller = msgCaller();
    if (users.has(caller.toString())) {
      log("User already exists", {
        caller,
        user,
      });
      return [];
    }
    users.set(caller.toString(), user);
    username_set.add(user.username);
    return [user];
  }

  @query([IDL.Text], IDL.Bool)
  username_exists(username: string): boolean {
    return username_set.has(username);
  }

  @update([User], IDL.Opt(User))
  update_user(user: User): [User] | [] {
    const caller = msgCaller();
    if (!users.has(caller.toString())) {
      log("User not found", {
        caller,
        user,
      });
      return [];
    }
    users.set(caller.toString(), user);
    return [user];
  }

  @update([], IDL.Opt(User))
  delete_user(): [User] | [] {
    const caller = msgCaller();
    const user = users.get(caller.toString());
    if (!user) {
      log("User not found", {
        caller,
      });
      return [];
    }
    users.delete(caller.toString());
    username_set.delete(user.username);
    return [user];
  }

  @update([IDL.Text], IDL.Bool)
  mark_notification_read(notificationId: string): boolean {
    const caller = msgCaller();
    const user = users.get(caller.toString());
    if (!user) {
      log("User not found", {
        caller,
      });
      return false;
    }
    const notification = user.notifications.find(
      (notification) => notification.notificationId === notificationId
    );
    if (!notification) {
      log("Notification not found", {
        caller,
        notificationId,
      });
      return false;
    }
    notification.read = true;
    return true;
  }

  @query([], IDL.Vec(Notification))
  get_notifications(): Notification[] {
    const caller = msgCaller();
    return users.get(caller.toString())?.notifications || [];
  }

  @query([], IDL.Vec(IDL.Text))
  get_personal_chat_rooms(): string[] {
    const caller = msgCaller();
    const user = users.get(caller.toString());
    if (!user) {
      log("User not found", {
        caller,
      });
      return [];
    }
    return user.personalChatRooms;
  }

  @query([], IDL.Vec(IDL.Text))
  get_chat_rooms(): string[] {
    const caller = msgCaller();
    const user = users.get(caller.toString());
    if (!user) {
      log("User not found", {
        caller,
      });
      return [];
    }
    return user.chatRooms;
  }
}
