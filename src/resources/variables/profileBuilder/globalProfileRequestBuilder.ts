import { AbstractVariablesResource } from '../abstractVariablesResource';
import { Transporter } from '../../../http/transporter';
import { GlobalVariableProfileResult, parseGlobalVariableProfileResult } from '../../../dataTypes/variables';

/**
 * A global variable profile request builder, allowing you to change multiple global variables at
 * once.
 */
export class GlobalProfileRequestBuilder extends AbstractVariablesResource {
  private readonly variables: Record<string, number> = {};

  /**
   * @param roomId The ID of the room
   * @param transporter The HTTP transporter
   */
  constructor(roomId: number, transporter: Transporter) {
    super(roomId, transporter);
  }

  /**
   * Change the value of a variable.
   *
   * @param variableName The name of the variable
   * @param value The value you want to assign to the variable
   */
  changeVariable(variableName: string, value: number): this {
    this.variables[variableName] = value;
    return this;
  }

  /**
   * Execute the built request.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async executeRequest(): Promise<GlobalVariableProfileResult> {
    const data = await this.transporter.patch(`/api/public/rooms/${this.roomId}/variables_profile/global`, {
      variables: this.variables,
    });
    return parseGlobalVariableProfileResult(data);
  }
}
