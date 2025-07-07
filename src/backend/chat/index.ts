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
} from "../utils";
import { UserService } from "../user";

export class MessagesService {
  personal_chat_rooms: Map<string, PersonalChatRoom> = new Map();

  @update([IDL.Text], IDL.Bool)
  create_personal_chat_room(
    receiver_username: string,
    receiver_id: string
  ): boolean {
    const caller = msgCaller();
    const sender_username = caller.toString();
    const pcr_id = generate_pcr_id(sender_username, receiver_username);
    if (this.personal_chat_rooms.has(pcr_id)) {
      return false;
    }
    const pcr: PersonalChatRoom = {
      id: pcr_id,
      participants: [caller, receiver_id],
      messages: [],
    };
    this.personal_chat_rooms.set(pcr_id, pcr);
    this.send_notification(
      receiver_username,
      `${sender_username} has created a new chat room with you.`,
      "system",
      "New Chat Room"
    );
    this.send_notification(
      sender_username,
      `Your chat room with ${receiver_username} has been created.`,
      "system",
      "New Chat Room"
    );
    return true;
  }

  @update([IDL.Text, IDL.Text], IDL.Bool)
  send_personal_message(
    pcr_id: string,
    content: string,
    receiver_id: string
  ): boolean {
    const message_id = generate_message_id();
    const message: PersonalMessage = {
      messageId: message_id,
      content: content,
      timestamp: BigInt(Date.now()),
      read: false,
    };
    const pcr = this.personal_chat_rooms.get(pcr_id);
    if (!pcr) {
      return false;
    }
    pcr.messages.push(message);
    this.send_notification(
      receiver_id,
      content.slice(0, 20) + "...",
      "message",
      "New Message"
    );
    return true;
  }

  @query([IDL.Text], IDL.Vec(PersonalMessage))
  get_personal_messages(pcr_id: string): PersonalMessage[] {
    const pcr = this.personal_chat_rooms.get(pcr_id);
    if (!pcr) {
      return [];
    }
    return pcr.messages;
  }

  send_notification(
    receiver_username: string,
    message: string,
    type: "message" | "proposal" | "system",
    title: string
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
    const user = userService.get_user(Principal.fromText(receiver_username))[0];
    if (!user) {
      return false;
    }
    user.notifications.push(notification);
    return true;
  }
}
