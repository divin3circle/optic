import { call, IDL, init, Principal, query, update, msgCaller } from "azle";
import { Position } from "./types";

export class PositionService {
  /************
   * DEPOSIT STATES
   * **********
   */

  positions: Map<Principal, Position[]> = new Map();

  /************
   * POSITION FUNCTIONS
   * **********
   */

  /**
   * Records a user's position in a pool
   * @param poolId - The ID of the pool
   * @returns The position that was recorded
   */

  @update(
    [IDL.Text, IDL.Text, IDL.Float64, IDL.Float64, IDL.Text, IDL.Float64],
    Position
  )
  async recordPosition(
    poolId: string,
    positionId: string,
    token0: string,
    token1: string,
    token0Amount: number,
    token1Amount: number,
    status: string,
    share: number
  ): Promise<Position> {
    const caller = msgCaller();
    const position: Position = {
      poolId,
      positionId,
      token0,
      token1,
      token0Amount,
      token1Amount,
      status,
      share,
      timestamp: Date.now(),
    };

    const positions = this.positions.get(caller) ?? [];
    positions.push(position);
    this.positions.set(caller, positions);
    return position;
  }

  /**
   * Close a user's position in a pool
   * @param poolId - The ID of the pool
   * @param positionId - The ID of the position
   * @returns True if the position was closed, false otherwise
   */

  @update([IDL.Text, IDL.Text], IDL.Bool)
  async closePosition(poolId: string, positionId: string): Promise<boolean> {
    const caller = msgCaller();
    const positions = this.positions.get(caller) ?? [];
    const position = positions.find(
      (position) =>
        position.poolId === poolId && position.positionId === positionId
    );
    if (!position) {
      return false;
    }
    position.status = "closed";
    this.positions.set(caller, positions);
    return true;
  }

  /**
   * Get all user positions
   * @returns All user positions
   */

  @query([], IDL.Vec(Position))
  async getAllUserPositions(): Promise<Position[]> {
    const caller = msgCaller();
    return Array.from(this.positions.get(caller) ?? []);
  }
}
