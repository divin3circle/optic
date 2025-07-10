import { users } from "../state";

export function generate_pcr_id(
  sender_username: string,
  receiver_username: string
): string {
  return `${sender_username}&${receiver_username}`;
}

export function generate_message_id(): string {
  return `m-${Date.now()}`;
}

export function generate_notification_id(): string {
  return `n-${Date.now()}`;
}

export function truncate_string(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function log(message: string, data: any) {
  console.log(message, data);
}

export function generate_chat_room_id(): string {
  return `cr-${Date.now()}`;
}

export function is_user_available(username: string): boolean {
  return users.has(username);
}
