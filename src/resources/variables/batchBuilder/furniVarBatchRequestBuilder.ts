import { AbstractVariablesResource } from '../abstractVariablesResource';
import { Transporter } from '../../../http/transporter';
import { FurniTargetKind, furniTargetKindKey } from '../../../param/furniTargetKind';
import { sanitiseFurniId } from '../../../util/furniIdSanitiser';
import { BatchResult, parseBatchResult } from '../../../dataTypes/variables';

interface BatchRequestEntry {
  op_id: string;
  method: 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: { value: bigint };
}

/**
 * A request builder to build a batch request for a furni variable.
 */
export class FurniVarBatchRequestBuilder extends AbstractVariablesResource {
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
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   */
  getVariable(opId: string, targetKind: FurniTargetKind, furniId: number): this {
    const sanitisedId = sanitiseFurniId(furniId);
    this.requests.push({
      op_id: opId,
      method: 'GET',
      path: `${furniTargetKindKey(targetKind)}/${sanitisedId}`,
    });
    return this;
  }

  /**
   * Assign a variable to a furni.
   *
   * @param opId The self-defined operation ID, use this same ID to find the response to this operation
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   * @param value The value to assign to the variable (defaults to -1n)
   */
  giveVariable(opId: string, targetKind: FurniTargetKind, furniId: number, value: bigint = -1n): this {
    const sanitisedId = sanitiseFurniId(furniId);
    this.requests.push({
      op_id: opId,
      method: 'PUT',
      path: `${furniTargetKindKey(targetKind)}/${sanitisedId}`,
      body: { value },
    });
    return this;
  }

  /**
   * Change the value of a variable assigned to a furni.
   *
   * @param opId The self-defined operation ID, use this same ID to find the response to this operation
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   * @param value The value to assign to the variable
   */
  changeVariable(opId: string, targetKind: FurniTargetKind, furniId: number, value: bigint): this {
    const sanitisedId = sanitiseFurniId(furniId);
    this.requests.push({
      op_id: opId,
      method: 'PATCH',
      path: `${furniTargetKindKey(targetKind)}/${sanitisedId}`,
      body: { value },
    });
    return this;
  }

  /**
   * Remove a variable assigned to a furni.
   *
   * @param opId The self-defined operation ID, use this same ID to find the response to this operation
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   */
  removeVariable(opId: string, targetKind: FurniTargetKind, furniId: number): this {
    const sanitisedId = sanitiseFurniId(furniId);
    this.requests.push({
      op_id: opId,
      method: 'DELETE',
      path: `${furniTargetKindKey(targetKind)}/${sanitisedId}`,
    });
    return this;
  }

  /**
   * Execute the built batch request.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async executeRequest(): Promise<BatchResult> {
    const data = await this.transporter.post(`/api/public/rooms/${this.roomId}/variables/furni/${this.varName}/batch`, {
      requests: this.requests,
    });
    return parseBatchResult(data);
  }
}
