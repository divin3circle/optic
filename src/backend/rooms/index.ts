/**
 * *************************
 * ------------------------
 * Rooms Service
 * ------------------------
 * *************************
 */

import { IDL, msgCaller, Principal, query, update } from "azle";
import { chat_rooms, treasury_records, users } from "../state";
import { generate_chat_room_id, generate_notification_id, log } from "../utils";
import { ChatRoom, Investor, Notification, TreasuryRecord } from "../types";

export class GroupChatService {
  @update(
    [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Float64],
    IDL.Bool
  )
  create_group_chat(
    name: string,
    treasury_token: string,
    contribution_cycle: string,
    investment_cycle: string,
    profile_image: string,
    description: string,
    max_contribution: number
  ): boolean {
    const caller = msgCaller();
    const user = users.get(caller.toString());
    if (!user) {
      log("User is not a member of Optic platform", "error");
      return false;
    }
    if (
      contribution_cycle !== "daily" &&
      contribution_cycle !== "weekly" &&
      contribution_cycle !== "monthly"
    ) {
      log("Invalid contribution cycle", "error");
      return false;
    }
    if (
      investment_cycle !== "weekly" &&
      investment_cycle !== "monthly" &&
      investment_cycle !== "yearly"
    ) {
      log("Invalid investment cycle", "error");
      return false;
    }
    const next_contribution_date =
      BigInt(Date.now()) + BigInt(1000 * 60 * 60 * 24); // 1 day
    const next_investment_date =
      BigInt(Date.now()) + BigInt(1000 * 60 * 60 * 24 * 30); // 30 days

    const new_chat_room: ChatRoom = {
      id: generate_chat_room_id(),
      name,
      description,
      profileImage: profile_image,
      admin: caller,
      members: [caller],
      treasury: { token: treasury_token, amount: 0 },
      investors: [],
      contributionCycle: contribution_cycle,
      investmentCycle: investment_cycle,
      maxContribution: max_contribution,
      createdAt: BigInt(Date.now()),
      messages: [],
      nextContributionDate: next_contribution_date,
      nextInvestmentDate: next_investment_date,
    };
    chat_rooms.set(new_chat_room.id, new_chat_room);
    user.chatRooms.push(new_chat_room.id);
    this.send_notification(
      `You have created a new group chat: ${name}`,
      "system",
      "Group Chat Created",
      caller
    );
    log("Group chat created successfully", "success");
    return true;
  }

  @query([], IDL.Vec(ChatRoom))
  get_all_group_chats(): ChatRoom[] {
    return Array.from(chat_rooms.values()) || [];
  }
  @query([IDL.Text], IDL.Opt(ChatRoom))
  get_group_chat(group_chat_id: string): [ChatRoom] | [] {
    const chat_room = chat_rooms.get(group_chat_id);
    return chat_room ? [chat_room] : [];
  }

  @update([IDL.Text, IDL.Principal], IDL.Bool)
  send_invite(group_chat_id: string, invitee_id: Principal): boolean {
    const invitee = users.get(invitee_id.toString());
    if (!invitee) {
      log("Invitee not found", {
        invitee_id,
      });
      return false;
    }
    const chat_room = chat_rooms.get(group_chat_id);
    if (!chat_room) {
      log("Chat room not found", {
        group_chat_id,
      });
      return false;
    }
    this.send_notification(
      `You have been invited to join ${chat_room.name}`,
      "system",
      "Group Chat Invitation",
      invitee_id
    );
    return true;
  }

  @update([IDL.Text], IDL.Bool)
  update_next_dates(group_chat_id: string): boolean {
    const chat_room = chat_rooms.get(group_chat_id);
    if (!chat_room) {
      log("Chat room not found", {
        group_chat_id,
      });
      log("Next dates not updated", "error");
      return false;
    }
    const now = BigInt(Date.now());
    const next_contribution_date =
      now + this.get_cycle_duration(chat_room.contributionCycle);
    const next_investment_date =
      now + this.get_cycle_duration(chat_room.investmentCycle);
    chat_room.nextContributionDate = next_contribution_date;
    chat_room.nextInvestmentDate = next_investment_date;
    log("Next dates updated successfully", "success");
    return true;
  }

  @update([IDL.Text, IDL.Float64, IDL.Text, IDL.Principal], IDL.Bool)
  contribute_to_chat_room(
    group_chat_id: string,
    amount: number,
    token: string,
    contributor: Principal
  ): boolean {
    const room = chat_rooms.get(group_chat_id);
    if (!room) {
      log("Chat room not found", { group_chat_id });
      return false;
    }

    const user = users.get(contributor.toString());
    if (!user) {
      log(
        "The user contributing is not on the platform",
        contributor.toString()
      );
      return false;
    }

    let feeShare = 0;
    if (room.investors.length === 0) {
      feeShare = 1; // 100% if first investor
    } else {
      const total_amount = room.investors
        .map((investor) => investor.amountInvested)
        .reduce((a, b) => a + b, 0);
      feeShare = total_amount === 0 ? 1 : amount / (total_amount + amount);
    }

    const investor: Investor = {
      principalId: contributor,
      amountInvested: amount,
      feeShare: feeShare,
    };
    room.investors.push(investor);

    const treasury_record = treasury_records.get(group_chat_id) || [];
    const tokenIndex = treasury_record.findIndex(
      (record) => record.token === token
    );

    if (tokenIndex === -1) {
      const new_treasury_record: TreasuryRecord = {
        token: token,
        amount: amount,
        timestamp: BigInt(Date.now()),
      };
      treasury_record.push(new_treasury_record);
    } else {
      treasury_record[tokenIndex].amount += amount;
      treasury_record[tokenIndex].timestamp = BigInt(Date.now());
    }
    treasury_records.set(group_chat_id, treasury_record);

    return true;
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

  get_cycle_duration(cycle: string): bigint {
    if (cycle === "daily") {
      return BigInt(1000 * 60 * 60 * 24);
    } else if (cycle === "weekly") {
      return BigInt(1000 * 60 * 60 * 24 * 7);
    } else if (cycle === "monthly") {
      return BigInt(1000 * 60 * 60 * 24 * 30);
    } else if (cycle === "yearly") {
      return BigInt(1000 * 60 * 60 * 24 * 365);
    } else {
      return BigInt(0);
    }
  }
}
