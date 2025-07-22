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

/**
 * BigInt utility functions for precise financial calculations
 * All amounts are stored as BigInt with 8 decimal places (like satoshis)
 */

// Constants for precision
export const PRECISION = 8; // 8 decimal places
export const PRECISION_MULTIPLIER = BigInt(10 ** PRECISION); // 100000000

/**
 * Convert a number to BigInt with precision
 * @param amount - The amount as a number (e.g., 1.5)
 * @returns BigInt representation (e.g., 150000000 for 1.5)
 */
export function toBigInt(amount: number): bigint {
  return BigInt(Math.round(amount * Number(PRECISION_MULTIPLIER)));
}

/**
 * Convert BigInt back to number with precision
 * @param amount - The BigInt amount
 * @returns Number representation
 */
export function fromBigInt(amount: bigint): number {
  return Number(amount) / Number(PRECISION_MULTIPLIER);
}

/**
 * Add two BigInt amounts
 */
export function addBigInt(a: bigint, b: bigint): bigint {
  return a + b;
}

/**
 * Subtract two BigInt amounts
 */
export function subtractBigInt(a: bigint, b: bigint): bigint {
  return a - b;
}

/**
 * Multiply BigInt by a number (for percentage calculations)
 * @param amount - BigInt amount
 * @param multiplier - Number multiplier (e.g., 0.5 for 50%)
 * @returns BigInt result
 */
export function multiplyBigInt(amount: bigint, multiplier: number): bigint {
  return (amount * BigInt(Math.round(multiplier * 10000))) / BigInt(10000);
}

/**
 * Calculate percentage as basis points (1% = 100 basis points)
 * @param amount - BigInt amount
 * @param basisPoints - Basis points (e.g., 500 for 5%)
 * @returns BigInt result
 */
export function calculatePercentage(
  amount: bigint,
  basisPoints: number
): bigint {
  return (amount * BigInt(basisPoints)) / BigInt(10000);
}

/**
 * Calculate fee share as basis points
 * @param individualAmount - Individual's amount
 * @param totalAmount - Total amount
 * @returns Basis points (e.g., 5000 for 50%)
 */
export function calculateFeeShare(
  individualAmount: bigint,
  totalAmount: bigint
): bigint {
  if (totalAmount === BigInt(0)) {
    return BigInt(10000); // 100% if total is 0
  }
  return (individualAmount * BigInt(10000)) / totalAmount;
}

/**
 * Validate that a BigInt amount is positive
 */
export function isPositiveBigInt(amount: bigint): boolean {
  return amount > BigInt(0);
}

/**
 * Convert USD amount to BigInt with precision
 * @param usdAmount - USD amount as number
 * @returns BigInt representation
 */
export function usdToBigInt(usdAmount: number): bigint {
  return toBigInt(usdAmount);
}

/**
 * Convert BigInt to USD amount
 * @param amount - BigInt amount
 * @returns USD amount as number
 */
export function bigIntToUsd(amount: bigint): number {
  return fromBigInt(amount);
}

/**
 * Test function to verify BigInt precision calculations
 * This demonstrates that we avoid floating point precision errors
 */
export function testBigIntPrecision(): void {
  // Test case: 0.1 + 0.2 should equal 0.3 (this fails with floating point)
  const amount1 = toBigInt(0.1);
  const amount2 = toBigInt(0.2);
  const result = addBigInt(amount1, amount2);
  const expected = toBigInt(0.3);

  log("BigInt Precision Test:", {
    amount1: fromBigInt(amount1),
    amount2: fromBigInt(amount2),
    result: fromBigInt(result),
    expected: fromBigInt(expected),
    isCorrect: result === expected,
    // This would fail with floating point: 0.1 + 0.2 !== 0.3
  });
}
