import { AbstractVariablesResource } from './abstractVariablesResource';
import { Transporter } from '../../http/transporter';
import {
  GlobalVariableProfileResult,
  parseGlobalVariableProfileResult,
  VariableResult,
  parseVariableResult,
} from '../../dataTypes/variables';
import { GlobalProfileRequestBuilder } from './profileBuilder/globalProfileRequestBuilder';

/**
 * Allows access to the endpoints for global variables.
 */
export class GlobalVariablesResource extends AbstractVariablesResource {
  constructor(roomId: number, transporter: Transporter) {
    super(roomId, transporter);
  }

  /**
   * Get the value of a variable.
   *
   * @param varName The name of the variable
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async getVariable(varName: string): Promise<VariableResult> {
    const data = await this.transporter.get(`/api/public/rooms/${this.roomId}/variables/global/${varName}`);
    return parseVariableResult(data);
  }

  /**
   * Change the value of a variable.
   *
   * @param varName The name of the variable
   * @param value The value to assign
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async changeVariable(varName: string, value: number): Promise<VariableResult> {
    const data = await this.transporter.patch(`/api/public/rooms/${this.roomId}/variables/global/${varName}`, {
      value,
    });
    return parseVariableResult(data);
  }

  /**
   * List all global variables and their values.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async getProfile(): Promise<GlobalVariableProfileResult> {
    const data = await this.transporter.get(`/api/public/rooms/${this.roomId}/variables_profile/global`);
    return parseGlobalVariableProfileResult(data);
  }

  /**
   * Change multiple global variable values.
   *
   * @param variables The new values for the variables, use the variable name as the key
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async changeProfile(variables: Record<string, number>): Promise<GlobalVariableProfileResult> {
    const data = await this.transporter.patch(`/api/public/rooms/${this.roomId}/variables_profile/global`, {
      variables,
    });
    return parseGlobalVariableProfileResult(data);
  }

  /**
   * Create a profile request builder.
   */
  buildChangeProfileRequest(): GlobalProfileRequestBuilder {
    return new GlobalProfileRequestBuilder(this.roomId, this.transporter);
  }
}
