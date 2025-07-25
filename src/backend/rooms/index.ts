/**
 * *************************
 * ------------------------
 * Rooms Service
 * ------------------------
 * *************************
 */

import { IDL, Principal, query, update } from "azle";
import {
  chat_rooms,
  group_messages,
  member_contribution_records,
  member_room_share_record,
  room_contribution_records,
  room_investment_records,
  room_share_record,
  treasury_records,
  users,
} from "../state";
import {
  generate_chat_room_id,
  generate_message_id,
  generate_notification_id,
  log,
  toBigInt,
  fromBigInt,
  addBigInt,
  calculateFeeShare,
  isPositiveBigInt,
  usdToBigInt,
} from "../utils";
import {
  ChatMessage,
  ChatRoom,
  Investor,
  MemberContributionRecord,
  Notification,
  InvestmentRecord,
  TreasuryRecord,
  ContributionRecord,
} from "../types";

export class GroupChatService {
  @update(
    [
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Float64,
      IDL.Text,
    ],
    IDL.Bool
  )
  create_group_chat(
    name: string,
    treasury_token: string,
    contribution_cycle: string,
    investment_cycle: string,
    profile_image: string,
    description: string,
    max_contribution: number,
    created_by: string
  ): boolean {
    const user = users.get(created_by);
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
      admin: Principal.fromText(created_by),
      members: [Principal.fromText(created_by)],
      treasury: { token: treasury_token, amount: BigInt(0) },
      investors: [],
      contributionCycle: contribution_cycle,
      investmentCycle: investment_cycle,
      investedAmount: BigInt(0),
      maxContribution: toBigInt(max_contribution),
      createdAt: BigInt(Date.now()),
      messages: [],
      nextContributionDate: next_contribution_date,
      nextInvestmentDate: next_investment_date,
      minimumAccountBalance: BigInt(0),
    };
    chat_rooms.set(new_chat_room.id, new_chat_room);
    user.chatRooms.push(new_chat_room.id);
    room_investment_records.set(new_chat_room.id, {
      token: treasury_token,
      amount: BigInt(0),
      updatedAt: BigInt(Date.now()),
    });
    this.send_notification(
      `You have created a new group chat: ${name}`,
      "system",
      "Group Chat Created",
      Principal.fromText(created_by),
      [new_chat_room.id]
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

  @query([IDL.Text, IDL.Int], IDL.Vec(ChatMessage))
  get_group_chat_messages(group_chat_id: string, limit: bigint): ChatMessage[] {
    if (!limit) {
      limit = BigInt(10);
    }
    const chat_room = chat_rooms.get(group_chat_id);
    if (!chat_room) {
      log("The chat room was not found", {
        group_chat_id,
      });
      return [];
    }
    const offSetMessageIds = chat_room.messages.slice(
      chat_room.messages.length - Number(limit)
    );
    const messages = offSetMessageIds.map((message_id) => {
      return group_messages.get(message_id) || null;
    });
    return messages.filter((message) => message !== null);
  }

  @update([IDL.Text, IDL.Text, IDL.Text], IDL.Bool)
  send_group_message(
    group_chat_id: string,
    message: string,
    sender: string
  ): boolean {
    const chat_room = chat_rooms.get(group_chat_id);
    if (!chat_room) {
      log("Chat room not found", {
        group_chat_id,
      });
      return false;
    }
    const message_id = generate_message_id();
    const new_message: ChatMessage = {
      messageId: message_id,
      roomId: group_chat_id,
      sender: Principal.fromText(sender),
      content: message,
      timestamp: BigInt(Date.now()),
      reactions: [],
      replies: [],
    };
    group_messages.set(message_id, new_message);
    chat_room.messages.push(message_id);
    chat_room.members.forEach((member) => {
      this.send_notification(
        `New message in ${chat_room.name}`,
        "message",
        "Group Chat Message",
        member,
        [group_chat_id]
      );
    });
    return true;
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
      invitee_id,
      [group_chat_id]
    );
    return true;
  }

  @update([IDL.Text, IDL.Text], IDL.Bool)
  join_group_chat(group_chat_id: string, user_id: string): boolean {
    const room = chat_rooms.get(group_chat_id);
    if (!room) {
      log("Chat room not found", group_chat_id);
      return false;
    }
    const user = users.get(user_id);
    if (!user) {
      log("User not found", user_id);
      return false;
    }
    room.members.push(Principal.fromText(user_id));
    user.chatRooms.push(group_chat_id);
    this.send_notification(
      `You have joined ${room.name}`,
      "system",
      "Group Chat Joined",
      Principal.fromText(user_id),
      [group_chat_id]
    );
    return true;
  }

  @query([IDL.Text], IDL.Opt(InvestmentRecord))
  get_group_chat_total_contributions(
    group_chat_id: string
  ): [InvestmentRecord] | [] {
    const room = chat_rooms.get(group_chat_id);
    if (!room) {
      log("Chat room not found", { group_chat_id });
      return [];
    }
    const investment_record = room_investment_records.get(group_chat_id);
    if (!investment_record) {
      log("Investment record not found", { group_chat_id });
      return [];
    }
    return [investment_record];
  }

  @query([IDL.Text], IDL.Vec(ContributionRecord))
  get_group_chat_historical_contribution_records(
    group_chat_id: string
  ): ContributionRecord[] | [] {
    const room = chat_rooms.get(group_chat_id);
    if (!room) {
      log("Chat room not found", { group_chat_id });
      return [];
    }
    const contribution_records = room_contribution_records.get(group_chat_id);
    if (!contribution_records) {
      log("Contribution records not found", { group_chat_id });
      return [];
    }
    return contribution_records;
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

  @update([IDL.Text, IDL.Int, IDL.Text, IDL.Principal], IDL.Bool)
  async contribute_to_chat_room(
    group_chat_id: string,
    amount: bigint,
    token: string,
    contributor: Principal
  ): Promise<boolean> {
    try {
      // Input validation
      if (!isPositiveBigInt(amount)) {
        log("Invalid contribution amount", {
          amount: amount.toString(),
          group_chat_id,
        });
        return false;
      }

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

      // Check if user is a member of the room
      if (!room.members.includes(contributor)) {
        log("User is not a member of this room", {
          contributor: contributor.toString(),
          group_chat_id,
        });
        return false;
      }

      // Check contribution limits
      if (room.maxContribution > BigInt(0) && amount > room.maxContribution) {
        log("Contribution exceeds maximum allowed", {
          amount: amount.toString(),
          maxContribution: room.maxContribution.toString(),
        });
        return false;
      }

      // Get conversion rate for USD calculation
      const conversionRate = await this.get_conversion_rate(token);
      if (conversionRate <= 0) {
        log("Invalid conversion rate", { token, conversionRate });
        return false;
      }

      // Calculate total amount before this contribution
      const totalAmountBefore = room.investors
        .map((investor) => investor.amountInvested)
        .reduce((a, b) => addBigInt(a, b), BigInt(0));

      // Check if this user already has an investment in this room
      const existingInvestorIndex = room.investors.findIndex(
        (investor) => investor.principalId.toString() === contributor.toString()
      );

      let newTotalAmount: bigint;
      let newFeeShare: bigint;

      if (existingInvestorIndex !== -1) {
        // User already has an investment - update their amount
        const existingInvestor = room.investors[existingInvestorIndex];
        const newAmount = addBigInt(existingInvestor.amountInvested, amount);
        newTotalAmount = addBigInt(totalAmountBefore, amount);
        newFeeShare = calculateFeeShare(newAmount, newTotalAmount);

        // Update existing investor
        room.investors[existingInvestorIndex].amountInvested = newAmount;
        room.investors[existingInvestorIndex].feeShare = newFeeShare;
      } else {
        // New investor
        newTotalAmount = addBigInt(totalAmountBefore, amount);
        newFeeShare = calculateFeeShare(amount, newTotalAmount);

        const investor: Investor = {
          principalId: contributor,
          amountInvested: amount,
          feeShare: newFeeShare,
        };
        room.investors.push(investor);
      }

      // Recalculate ALL investors' fee shares based on new total
      room.investors.forEach((investor) => {
        investor.feeShare = calculateFeeShare(
          investor.amountInvested,
          newTotalAmount
        );
      });

      // Create contribution record
      const contribution_record: ContributionRecord = {
        contributor: contributor,
        roomId: group_chat_id,
        amount: amount,
        amountInUSD: usdToBigInt(fromBigInt(amount) * conversionRate),
        token: token,
        timestamp: BigInt(Date.now()),
      };

      // Update room investment record
      const room_investment_record = room_investment_records.get(group_chat_id);
      if (!room_investment_record) {
        log("Room investment record not found", { group_chat_id });
        return false;
      }
      room_investment_record.amount = addBigInt(
        room_investment_record.amount,
        amount
      );
      room_investment_record.updatedAt = BigInt(Date.now());

      // Update member's share of the room with unique key (userId_roomId)
      const memberRoomKey = `${contributor.toString()}_${group_chat_id}`;
      member_room_share_record.set(
        memberRoomKey,
        fromBigInt(newFeeShare) / 10000
      ); // Convert basis points to decimal

      // Update room's contribution records
      const existingContributions =
        room_contribution_records.get(group_chat_id) || [];
      room_contribution_records.set(group_chat_id, [
        ...existingContributions,
        contribution_record,
      ]);

      // Update member's contribution records across all rooms
      const memberKey = contributor.toString();
      const existingMemberContributions =
        member_contribution_records.get(memberKey) || [];
      const memberContributionRecord: MemberContributionRecord = {
        roomId: group_chat_id,
        room: room.name,
        amount: amount,
        amountInUSD: contribution_record.amountInUSD,
        token: token,
        timestamp: BigInt(Date.now()),
      };
      member_contribution_records.set(memberKey, [
        ...existingMemberContributions,
        memberContributionRecord,
      ]);

      // Update treasury records
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
        treasury_record[tokenIndex].amount = addBigInt(
          treasury_record[tokenIndex].amount,
          amount
        );
        treasury_record[tokenIndex].timestamp = BigInt(Date.now());
      }
      treasury_records.set(group_chat_id, treasury_record);

      // Calculate and update room's share relative to all groups
      // This requires calculating total contributions across all rooms
      let totalAllRoomsContribution = BigInt(0);
      for (const [roomId, investmentRecord] of room_investment_records) {
        totalAllRoomsContribution = addBigInt(
          totalAllRoomsContribution,
          investmentRecord.amount
        );
      }

      const roomSharePercentage =
        totalAllRoomsContribution === BigInt(0)
          ? 0
          : fromBigInt(room_investment_record.amount) /
            fromBigInt(totalAllRoomsContribution);
      room_share_record.set(group_chat_id, roomSharePercentage);

      // Send notification to room admin about the contribution
      this.send_notification(
        `New contribution of ${fromBigInt(amount)} ${token} received from ${
          user.username
        }`,
        "system",
        "New Contribution",
        room.admin,
        []
      );

      // Calculate member's total contributions across all rooms for logging
      const memberTotalContributions =
        member_contribution_records.get(contributor.toString())?.length || 0;

      log("Contribution processed successfully", {
        group_chat_id,
        contributor: contributor.toString(),
        amount: amount.toString(),
        token,
        newFeeShare: fromBigInt(newFeeShare) / 10000,
        roomSharePercentage,
        memberTotalContributions,
        memberTotalRooms:
          member_contribution_records.get(contributor.toString())?.length || 0,
      });

      return true;
    } catch (error) {
      log("Error processing contribution", {
        error,
        group_chat_id,
        contributor: contributor.toString(),
        amount: amount.toString(),
      });
      return false;
    }
  }

  @query([IDL.Text], IDL.Bool)
  withdraw_investment(
    group_chat_id: string,
    token: string,
    investor: Principal
  ): boolean {
    const room = chat_rooms.get(group_chat_id);
    if (!room) {
      log("Chat room not found", { group_chat_id });
      return false;
    }
    return true;
  }

  send_notification(
    message: string,
    type: "message" | "proposal" | "system",
    title: string,
    receiver_id: Principal,
    data: [string] | []
  ): boolean {
    const notification: Notification = {
      notificationId: generate_notification_id(),
      type: type,
      title: title,
      message: message,
      read: false,
      timestamp: BigInt(Date.now()),
      data,
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

  get_group_messages(message_id: string): ChatMessage | null {
    const message = group_messages.get(message_id);
    if (!message) {
      log("The message was not found", {
        message_id,
      });
      return null;
    }
    return message;
  }

  async get_conversion_rate(token: string): Promise<number> {
    const formattedToken = this.format_token(token);
    const price_url = `https://api.binance.com/api/v3/ticker/price?symbol=${formattedToken}USDT`;
    try {
      const response = await fetch(price_url);
      const data = await response.json();
      const price = parseFloat(data.price);
      return price;
    } catch (error) {
      log("Error fetching conversion rate", { error });
      return 1;
    }
  }

  format_token(token: string): string {
    if (token.startsWith("ck")) {
      return token.slice(2);
    }
    return token;
  }

  @query([IDL.Principal], IDL.Int)
  get_member_total_contributions(member: Principal): bigint {
    const memberKey = member.toString();
    const contributions = member_contribution_records.get(memberKey) || [];

    const totalAmount = contributions.reduce((total, record) => {
      return addBigInt(total, record.amount);
    }, BigInt(0));

    log("Calculated member total contributions", {
      member: memberKey,
      totalAmount: totalAmount.toString(),
      contributionCount: contributions.length,
    });

    return totalAmount;
  }

  @query([IDL.Principal], IDL.Int)
  get_member_total_contributions_usd(member: Principal): bigint {
    const memberKey = member.toString();
    const contributions = member_contribution_records.get(memberKey) || [];

    const totalUSD = contributions.reduce((total, record) => {
      return addBigInt(total, record.amountInUSD);
    }, BigInt(0));

    log("Calculated member total USD contributions", {
      member: memberKey,
      totalUSD: totalUSD.toString(),
      contributionCount: contributions.length,
    });

    return totalUSD;
  }
}
