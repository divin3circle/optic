/**
 * *************************
 * ------------------------
 * User Service
 * ------------------------
 * *************************
 */

import { query, update, Principal, IDL } from "azle";
import { User, Notification, MemberContributionRecord } from "../types";
import {
  users,
  username_set,
  member_room_share_record,
  member_contribution_records,
} from "../state";
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
    if (users.has(user.id)) {
      log("User already exists", {
        user,
      });
      return [];
    }
    users.set(user.id, user);
    username_set.add(user.username);
    member_room_share_record.set(user.id, 0);
    return [user];
  }

  @query([IDL.Text], IDL.Bool)
  username_exists(username: string): boolean {
    return username_set.has(username);
  }

  @query([IDL.Text], IDL.Opt(User))
  get_user_by_username(username: string): [User] | [] {
    const user = Array.from(users.values()).find(
      (user) => user.username === username
    );
    return user ? [user] : [];
  }

  @update([User], IDL.Opt(User))
  update_user(user: User): [User] | [] {
    if (!users.has(user.id)) {
      log("User not found", {
        user,
      });
      return [];
    }
    users.set(user.id, user);
    return [user];
  }

  @update([], IDL.Opt(User))
  delete_user(id: string): [User] | [] {
    const user = users.get(id);
    if (!user) {
      log("User not found", {
        id,
      });
      return [];
    }
    users.delete(user.id);
    username_set.delete(user.username);
    return [user];
  }

  @update([IDL.Text], IDL.Bool)
  mark_notification_read(id: string, notificationId: string): boolean {
    const user = users.get(id);
    if (!user) {
      log("User not found", {
        id,
      });
      return false;
    }
    const notification = user.notifications.find(
      (notification) => notification.notificationId === notificationId
    );
    if (!notification) {
      log("Notification not found", {
        notificationId,
      });
      return false;
    }
    notification.read = true;
    return true;
  }

  @query([], IDL.Vec(Notification))
  get_notifications(id: string): Notification[] {
    return users.get(id)?.notifications || [];
  }

  @query([], IDL.Vec(IDL.Text))
  get_personal_chat_rooms(id: string): string[] {
    const user = users.get(id);
    if (!user) {
      log("User not found", {
        id,
      });
      return [];
    }
    return user.personalChatRooms;
  }

  @query([], IDL.Vec(IDL.Text))
  get_chat_rooms(id: string): string[] {
    const user = users.get(id);
    if (!user) {
      log("User not found", {
        id,
      });
      return [];
    }
    return user.chatRooms;
  }

  @query([IDL.Text], IDL.Int)
  get_member_room_share_record(id: string): number {
    const user = users.get(id);
    if (!user) {
      log("User not found", { id });
      return 0;
    }
    return member_room_share_record.get(id) || 0;
  }

  @query([IDL.Text], IDL.Vec(MemberContributionRecord))
  get_member_contribution_records(id: string): MemberContributionRecord[] {
    return member_contribution_records.get(id) || [];
  }
}
