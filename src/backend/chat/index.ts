/**
 * *************************
 * ------------------------
 * Messages Service
 * ------------------------
 * *************************
 */

import { query, update, Principal, IDL } from "azle";
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
import { personal_chat_rooms, users } from "../state";

export class MessagesService {
  @update([IDL.Text, IDL.Text], IDL.Bool)
  create_personal_chat_room(receiver_id: string, sender_id: string): boolean {
    const pcr_id = generate_pcr_id(sender_id, receiver_id);
    if (personal_chat_rooms.has(pcr_id)) {
      log("Personal chat room already exists", {
        pcr_id,
        sender_id,
        receiver_id,
      });
      return false;
    }
    const receiver = users.get(receiver_id);
    const sender = users.get(sender_id);
    if (!receiver) {
      log("Receiver not found", {
        receiver_id,
      });
      return false;
    }
    if (!sender) {
      log("Sender not found", {
        sender_id,
      });
      return false;
    }
    sender.personalChatRooms.push(pcr_id);
    receiver.personalChatRooms.push(pcr_id);
    const pcr: PersonalChatRoom = {
      id: pcr_id,
      participants: [
        Principal.fromText(sender_id),
        Principal.fromText(receiver_id),
      ],
      messages: [],
    };
    personal_chat_rooms.set(pcr_id, pcr);
    this.send_notification(
      `${sender.username} has created a new chat room with you.`,
      "system",
      "New Chat Room",
      Principal.fromText(receiver_id)
    );
    this.send_notification(
      `Your chat room with ${receiver.username} has been created.`,
      "system",
      "New Chat Room",
      Principal.fromText(sender_id)
    );
    return true;
  }

  @query([IDL.Text], IDL.Opt(PersonalChatRoom))
  get_personal_chat_room(pcr_id: string): [PersonalChatRoom] | [] {
    const pcr = personal_chat_rooms.get(pcr_id);
    if (!pcr) {
      return [];
    }
    return [pcr];
  }

  @query([IDL.Text], IDL.Vec(User))
  get_personal_chat_room_participants(pcr_id: string): User[] | [] {
    const pcr = personal_chat_rooms.get(pcr_id);
    if (!pcr) {
      return [];
    }
    return pcr.participants
      .map((participant) => users.get(participant.toString()) || null)
      .filter((user) => user !== null);
  }

  @update([IDL.Text, IDL.Text, IDL.Principal], IDL.Bool)
  send_personal_message(
    pcr_id: string,
    content: string,
    receiver_id: Principal
  ): boolean {
    const message_id = generate_message_id();
    const message: PersonalMessage = {
      receiver: receiver_id.toString(),
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
    const user = users.get(receiver_id.toString());
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
