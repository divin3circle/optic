/**
 * *************************
 * ------------------------
 * Messages Service
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
import {
  generate_message_id,
  generate_notification_id,
  generate_pcr_id,
  log,
  truncate_string,
} from "../utils";
import { UserService } from "../user";
import { personal_chat_rooms, users } from "../state";

export class MessagesService {
  @update([IDL.Text, IDL.Principal], IDL.Bool)
  create_personal_chat_room(
    receiver_username: string,
    receiver_id: Principal
  ): boolean {
    const caller = msgCaller();
    const sender_username = caller.toString();
    const pcr_id = generate_pcr_id(sender_username, receiver_username);
    if (personal_chat_rooms.has(pcr_id)) {
      log("Personal chat room already exists", {
        pcr_id,
        sender_username,
        receiver_username,
        receiver_id,
      });
      return false;
    }
    const receiver = users.get(receiver_id.toString());
    const sender = users.get(caller.toString());
    if (!receiver || !sender) {
      log("User not found", {
        receiver_id,
      });
      return false;
    }
    sender.personalChatRooms.push(pcr_id);
    receiver.personalChatRooms.push(pcr_id);
    const pcr: PersonalChatRoom = {
      id: pcr_id,
      participants: [caller, receiver_id],
      messages: [],
    };
    personal_chat_rooms.set(pcr_id, pcr);
    this.send_notification(
      `${sender_username} has created a new chat room with you.`,
      "system",
      "New Chat Room",
      receiver_id
    );
    this.send_notification(
      `Your chat room with ${receiver_username} has been created.`,
      "system",
      "New Chat Room",
      caller.toString()
    );
    return true;
  }

  @update([IDL.Text, IDL.Text, IDL.Principal], IDL.Bool)
  send_personal_message(
    pcr_id: string,
    content: string,
    receiver_id: Principal
  ): boolean {
    const message_id = generate_message_id();
    const message: PersonalMessage = {
      messageId: message_id,
      content: content,
      timestamp: BigInt(Date.now()),
      read: false,
    };
    const pcr = personal_chat_rooms.get(pcr_id);
    if (!pcr) {
      log("Personal chat room not found", {
        pcr_id,
        message_id,
        content,
        receiver_id,
      });
      return false;
    }
    pcr.messages.push(message);
    this.send_notification(
      truncate_string(content, 20),
      "message",
      "New Message",
      receiver_id
    );
    return true;
  }

  @query([IDL.Text], IDL.Vec(PersonalMessage))
  get_personal_messages(pcr_id: string): PersonalMessage[] {
    const pcr = personal_chat_rooms.get(pcr_id);
    if (!pcr) {
      log("Personal chat room not found", {
        pcr_id,
      });
      return [];
    }
    return pcr.messages;
  }

  send_notification(
    message: string,
    type: "message" | "proposal" | "system",
    title: string,
    receiver_id: Principal
  ): boolean {
    const notification: Notification = {
      notificationId: generate_notification_id(),
      type: type,
      title: title,
      message: message,
      read: false,
      timestamp: BigInt(Date.now()),
    };
    const userService = new UserService();
    const user = userService.get_user(receiver_id)[0];
    if (!user) {
      log("User not found", {
        receiver_id,
      });
      return false;
    }
    user.notifications.push(notification);
    return true;
  }
}
