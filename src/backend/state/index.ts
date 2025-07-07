/**
 * *************************
 * Shared State
 * *************************
 */

import { ChatRoom, PersonalChatRoom, PersonalMessage, User } from "../types";

export const users: Map<string, User> = new Map();
export const username_set: Set<string> = new Set();
export const chat_rooms: Map<string, ChatRoom> = new Map();
export const notifications: Map<string, Notification> = new Map();
export const personal_messages: Map<string, PersonalMessage> = new Map();
export const personal_chat_rooms: Map<string, PersonalChatRoom> = new Map();
