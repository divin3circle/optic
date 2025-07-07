export function generate_pcr_id(
  sender_username: string,
  receiver_username: string
): string {
  return `${sender_username}&${receiver_username}`;
}

export function generate_message_id(): string {
  return `m${Date.now()}`;
}

export function generate_notification_id(): string {
  return `n${Date.now()}`;
}
