import { AbstractVariablesResource } from '../abstractVariablesResource';
import { Transporter } from '../../../http/transporter';
import { UserTargetKind, userTargetKindKey } from '../../../param/userTargetKind';
import { BatchResult, parseBatchResult } from '../../../dataTypes/variables';

interface BatchRequestEntry {
  op_id: string;
  method: 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: { value: number };
}

/**
 * A request builder to build a batch request for a user variable.
 */
export class UserVarBatchRequestBuilder extends AbstractVariablesResource {
  private readonly requests: BatchRequestEntry[] = [];

  /**
   * @param varName The variable name
   * @param roomId The ID of the room
   * @param transporter The HTTP transporter
   */
  constructor(
    private readonly varName: string,
    roomId: number,
    transporter: Transporter
  ) {
    super(roomId, transporter);
  }

  /**
   * Get the value of a variable.
   *
   * @param opId The self-defined operation ID, use this same ID to find the response to this operation
   * @param targetKind The target kind (user / pet / bot)
   * @param entityId The ID of the user, pet or bot
   */
  getVariable(opId: string, targetKind: UserTargetKind, entityId: number): this {
    this.requests.push({
      op_id: opId,
      method: 'GET',
      path: `${userTargetKindKey(targetKind)}/${entityId}`,
    });
    return this;
  }

  /**
   * Assign a variable to a user, pet or bot.
   *
   * @param opId The self-defined operation ID, use this same ID to find the response to this operation
   * @param targetKind The target kind (user / pet / bot)
   * @param entityId The ID of the user, pet or bot
   * @param value The value to assign to the variable (defaults to -1)
   */
  giveVariable(opId: string, targetKind: UserTargetKind, entityId: number, value: number = -1): this {
    this.requests.push({
      op_id: opId,
      method: 'PUT',
      path: `${userTargetKindKey(targetKind)}/${entityId}`,
      body: { value },
    });
    return this;
  }

  /**
   * Change the value of a variable assigned to a user, pet or bot.
   *
   * @param opId The self-defined operation ID, use this same ID to find the response to this operation
   * @param targetKind The target kind (user / pet / bot)
   * @param entityId The ID of the user, pet or bot
   * @param value The value to assign to the variable
   */
  changeVariable(opId: string, targetKind: UserTargetKind, entityId: number, value: number): this {
    this.requests.push({
      op_id: opId,
      method: 'PATCH',
      path: `${userTargetKindKey(targetKind)}/${entityId}`,
      body: { value },
    });
    return this;
  }

  /**
   * Remove a variable assigned to a user, pet or bot.
   *
   * @param opId The self-defined operation ID, use this same ID to find the response to this operation
   * @param targetKind The target kind (user / pet / bot)
   * @param entityId The ID of the user, pet or bot
   */
  removeVariable(opId: string, targetKind: UserTargetKind, entityId: number): this {
    this.requests.push({
      op_id: opId,
      method: 'DELETE',
      path: `${userTargetKindKey(targetKind)}/${entityId}`,
    });
    return this;
  }

  /**
   * Execute the built batch request.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async executeRequest(): Promise<BatchResult> {
    const data = await this.transporter.post(`/api/public/rooms/${this.roomId}/variables/user/${this.varName}/batch`, {
      requests: this.requests,
    });
    return parseBatchResult(data);
  }
}
