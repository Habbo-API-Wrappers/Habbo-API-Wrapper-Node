import { AbstractVariablesResource } from './abstractVariablesResource';
import { Transporter } from '../../http/transporter';
import { UserTargetKind, userTargetKindKey } from '../../param/userTargetKind';
import { OrderBy, orderByKey } from '../../param/orderBy';
import { OrderDir, orderDirKey } from '../../param/orderDir';
import {
  HolderCountResult,
  parseHolderCountResult,
  UserVariableHoldersResult,
  parseUserVariableHoldersResult,
  UserVariableProfileResult,
  parseUserVariableProfileResult,
  VariableResult,
  parseVariableResult,
} from '../../dataTypes/variables';
import { UserVarBatchRequestBuilder } from './batchBuilder/userVarBatchRequestBuilder';
import { UserProfileRequestBuilder } from './profileBuilder/userProfileRequestBuilder';

/**
 * Allows access to the endpoints for user variables.
 */
export class UserVariablesResource extends AbstractVariablesResource {
  constructor(roomId: number, transporter: Transporter) {
    super(roomId, transporter);
  }

  /**
   * Read a single user variable assignment.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (users / pets / bots)
   * @param entityId The ID of the user, pet or bot
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async getVariable(variableName: string, targetKind: UserTargetKind, entityId: number): Promise<VariableResult> {
    const data = await this.transporter.get(
      `/api/public/rooms/${this.roomId}/variables/user/${variableName}/${userTargetKindKey(targetKind)}/${entityId}`
    );
    return parseVariableResult(data);
  }

  /**
   * Assign a variable to a user, pet or bot.
   *
   * This method works similar to `WIRED Effect: Give Variable` with the `Override existing variable` checkbox enabled.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (users / pets / bots)
   * @param entityId The ID of the user, pet or bot
   * @param value (Optional) The value you want to assign to the variable
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async giveVariable(
    variableName: string,
    targetKind: UserTargetKind,
    entityId: number,
    value: bigint = -1n
  ): Promise<VariableResult> {
    const data = await this.transporter.put(
      `/api/public/rooms/${this.roomId}/variables/user/${variableName}/${userTargetKindKey(targetKind)}/${entityId}`,
      { value }
    );
    return parseVariableResult(data);
  }

  /**
   * Change the value of an existing user variable assignment.
   *
   * This method works similar to the `assign` option in `WIRED Effect: Change Variable Value`.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (users / pets / bots)
   * @param entityId The ID of the user, pet or bot
   * @param value The value you want to assign to the variable
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async changeVariable(
    variableName: string,
    targetKind: UserTargetKind,
    entityId: number,
    value: bigint
  ): Promise<VariableResult> {
    const data = await this.transporter.put(
      `/api/public/rooms/${this.roomId}/variables/user/${variableName}/${userTargetKindKey(targetKind)}/${entityId}`,
      { value }
    );
    return parseVariableResult(data);
  }

  /**
   * Remove the variable from the user, pet or bot.
   *
   * This method works similar to `WIRED Effect: Remove Variable`.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (users / pets / bots)
   * @param entityId The ID of the user, pet or bot
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async removeVariable(variableName: string, targetKind: UserTargetKind, entityId: number): Promise<void> {
    await this.transporter.delete(
      `/api/public/rooms/${this.roomId}/variables/user/${variableName}/${userTargetKindKey(targetKind)}/${entityId}`
    );
  }

  /**
   * List all users, pets or bots that hold the variable and their assigned values.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (users / pets / bots)
   * @param orderBy (optional) Defines what value the response will be ordered by (default = `OrderBy.CreationTime`)
   * @param orderDir (optional) Defines whether the response is in ascending or descending order (default = `OrderDir.Ascending`)
   * @param page (optional) The page you want to request (default = `1`)
   * @param pageSize (optional) The size of the page (default = `50`)
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async listHolders(
    variableName: string,
    targetKind: UserTargetKind,
    orderBy: OrderBy = OrderBy.CreationTime,
    orderDir: OrderDir = OrderDir.Ascending,
    page: number = 1,
    pageSize: number = 50
  ): Promise<UserVariableHoldersResult> {
    const data = await this.transporter.get(
      `/api/public/rooms/${this.roomId}/variables/user/${variableName}/${userTargetKindKey(targetKind)}`,
      {
        order_by: orderByKey(orderBy),
        order_dir: orderDirKey(orderDir),
        page,
        size: pageSize,
      }
    );
    return parseUserVariableHoldersResult(data);
  }

  /**
   * Get the amount of users, pets or bots that hold the variable.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (users / pets / bots)
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async countHolders(variableName: string, targetKind: UserTargetKind): Promise<HolderCountResult> {
    const data = await this.transporter.get(
      `/api/public/rooms/${this.roomId}/variables/user/${variableName}/${userTargetKindKey(targetKind)}/count`
    );
    return parseHolderCountResult(data);
  }

  /**
   * Creates a batch request builder, allowing you to give, change or remove the variable to/from
   * multiple users, pets and bots.
   *
   * @param variableName The name of the variable
   */
  buildBatchRequest(variableName: string): UserVarBatchRequestBuilder {
    return new UserVarBatchRequestBuilder(variableName, this.roomId, this.transporter);
  }

  /**
   * List all variables assigned to the user.
   *
   * @param username The username of the user
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async getProfileByUsername(username: string): Promise<UserVariableProfileResult> {
    const data = await this.transporter.get(`/api/public/rooms/${this.roomId}/variables_profile/user/users`, {
      name: username,
    });
    return parseUserVariableProfileResult(data);
  }

  /**
   * List all variables assigned to the user.
   *
   * @param uniqueId The unique ID of the user
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async getProfileByUniqueId(uniqueId: string): Promise<UserVariableProfileResult> {
    const data = await this.transporter.get(`/api/public/rooms/${this.roomId}/variables_profile/user/users`, {
      unique_id: uniqueId,
    });
    return parseUserVariableProfileResult(data);
  }

  /**
   * List all variables assigned to the user, pet or bot.
   *
   * @param targetKind The target kind (users / pets / bots)
   * @param entityId The ID of the user, pet or bot
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async getProfile(targetKind: UserTargetKind, entityId: number): Promise<UserVariableProfileResult> {
    const data = await this.transporter.get(
      `/api/public/rooms/${this.roomId}/variables_profile/user/${userTargetKindKey(targetKind)}/${entityId}`
    );
    return parseUserVariableProfileResult(data);
  }

  /**
   * Remove all variables assigned to the user, pet or bot.
   *
   * @param targetKind The target kind (users / pets / bots)
   * @param entityId The ID of the user, pet or bot
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async removeProfile(targetKind: UserTargetKind, entityId: number): Promise<void> {
    await this.transporter.delete(
      `/api/public/rooms/${this.roomId}/variables_profile/user/${userTargetKindKey(targetKind)}/${entityId}`
    );
  }

  /**
   * Change variables assigned to the user, pet or bot.
   *
   * @param targetKind The target kind (users / pets / bots)
   * @param entityId The ID of the user, pet or bot
   * @param variables The new values for the variables, use the variable name as the key, assigning null removes the variable
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async changeProfile(
    targetKind: UserTargetKind,
    entityId: number,
    variables: Record<string, number | null>
  ): Promise<UserVariableProfileResult> {
    const data = await this.transporter.patch(
      `/api/public/rooms/${this.roomId}/variables_profile/user/${userTargetKindKey(targetKind)}/${entityId}`,
      { variables }
    );
    return parseUserVariableProfileResult(data);
  }

  /**
   * Create a profile request builder.
   *
   * @param targetKind The target kind (users / pets / bots)
   * @param entityId The ID of the user, pet or bot
   */
  buildChangeProfileRequest(targetKind: UserTargetKind, entityId: number): UserProfileRequestBuilder {
    return new UserProfileRequestBuilder(targetKind, entityId, this.roomId, this.transporter);
  }
}
