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
import { generate_message_id, generate_pcr_id } from "../utils";

export class MessagesService {
  personal_chat_rooms: Map<string, PersonalChatRoom> = new Map();

  @update([IDL.Text], IDL.Bool)
  create_personal_chat_room(receiver_username: string): boolean {
    const caller = msgCaller();
    const sender_username = caller.toString();
    const pcr_id = generate_pcr_id(sender_username, receiver_username);
    if (this.personal_chat_rooms.has(pcr_id)) {
      return false;
    }
    const pcr: PersonalChatRoom = {
      id: pcr_id,
      participants: [caller, receiver_username],
      messages: [],
    };
    this.personal_chat_rooms.set(pcr_id, pcr);
    return true;
  }

  @update([IDL.Text, IDL.Text], IDL.Bool)
  send_personal_message(pcr_id: string, content: string): boolean {
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
}
