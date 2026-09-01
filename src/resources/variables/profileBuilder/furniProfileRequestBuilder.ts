import { AbstractVariablesResource } from '../abstractVariablesResource';
import { Transporter } from '../../../http/transporter';
import { FurniTargetKind, furniTargetKindKey } from '../../../param/furniTargetKind';
import { sanitiseFurniId } from '../../../util/furniIdSanitiser';
import { FurniVariableProfileResult, parseFurniVariableProfileResult } from '../../../dataTypes/variables';

/**
 * A furni variable profile request builder, allowing you to change multiple variables assigned
 * to a single furni at once.
 */
export class FurniProfileRequestBuilder extends AbstractVariablesResource {
  private readonly variables: Record<string, bigint | null> = {};

  /**
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   * @param roomId The ID of the room
   * @param transporter The HTTP transporter
   */
  constructor(
    private readonly targetKind: FurniTargetKind,
    private readonly furniId: number,
    roomId: number,
    transporter: Transporter
  ) {
    super(roomId, transporter);
  }

  /**
   * Change the value of a variable assignment or give a variable assignment.
   *
   * @param variableName The name of the variable
   * @param value The value you want to assign to the variable (defaults to -1n)
   */
  changeOrGiveVariable(variableName: string, value: bigint = -1n): this {
    this.variables[variableName] = value;
    return this;
  }

  /**
   * Remove a variable assignment.
   *
   * @param variableName The name of the variable
   */
  removeVariable(variableName: string): this {
    this.variables[variableName] = null;
    return this;
  }

  /**
   * Execute the built request.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async executeRequest(): Promise<FurniVariableProfileResult> {
    const furniId = sanitiseFurniId(this.furniId);
    const data = await this.transporter.patch(
      `/api/public/rooms/${this.roomId}/variables_profile/furni/${furniTargetKindKey(this.targetKind)}/${furniId}`,
      { variables: this.variables }
    );
    return parseFurniVariableProfileResult(data);
  }
}
