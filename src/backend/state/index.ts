/**
 * *************************
 * Shared State
 * *************************
 */

import {
  ChatRoom,
  Contribution,
  PersonalChatRoom,
  PersonalMessage,
  TreasuryRecord,
  User,
} from "../types";

export const users: Map<string, User> = new Map();
export const username_set: Set<string> = new Set();
export const chat_rooms: Map<string, ChatRoom> = new Map();
export const notifications: Map<string, Notification> = new Map();
export const personal_messages: Map<string, PersonalMessage> = new Map();
export const personal_chat_rooms: Map<string, PersonalChatRoom> = new Map();
export const treasury_records: Map<string, TreasuryRecord[]> = new Map();
