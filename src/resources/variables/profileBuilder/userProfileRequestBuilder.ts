import { AbstractVariablesResource } from '../abstractVariablesResource';
import { Transporter } from '../../../http/transporter';
import { UserTargetKind, userTargetKindKey } from '../../../param/userTargetKind';
import { UserVariableProfileResult, parseUserVariableProfileResult } from '../../../dataTypes/variables';

/**
 * A user variable profile request builder, allowing you to change multiple variables assigned to
 * a single user, pet or bot at once.
 */
export class UserProfileRequestBuilder extends AbstractVariablesResource {
  private readonly variables: Record<string, number | null> = {};

  /**
   * @param targetKind The target kind (user / pet / bot)
   * @param entityId The ID of the user, pet or bot
   * @param roomId The ID of the room
   * @param transporter The HTTP transporter
   */
  constructor(
    private readonly targetKind: UserTargetKind,
    private readonly entityId: number,
    roomId: number,
    transporter: Transporter
  ) {
    super(roomId, transporter);
  }

  /**
   * Change the value of a variable assignment or give a variable assignment.
   *
   * @param variableName The name of the variable
   * @param value The value you want to assign to the variable (defaults to -1)
   */
  changeOrGiveVariable(variableName: string, value: number = -1): this {
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
  async executeRequest(): Promise<UserVariableProfileResult> {
    const data = await this.transporter.patch(
      `/api/public/rooms/${this.roomId}/variables_profile/user/${userTargetKindKey(this.targetKind)}/${this.entityId}`,
      { variables: this.variables }
    );
    return parseUserVariableProfileResult(data);
  }
}
