import { AbstractVariablesResource } from './abstractVariablesResource';
import { Transporter } from '../../http/transporter';
import { FurniTargetKind, furniTargetKindKey } from '../../param/furniTargetKind';
import { OrderBy, orderByKey } from '../../param/orderBy';
import { OrderDir, orderDirKey } from '../../param/orderDir';
import { sanitiseFurniId } from '../../util/furniIdSanitiser';
import {
  FurniVariableHoldersResult,
  parseFurniVariableHoldersResult,
  FurniVariableProfileResult,
  parseFurniVariableProfileResult,
  HolderCountResult,
  parseHolderCountResult,
  VariableResult,
  parseVariableResult,
} from '../../dataTypes/variables';
import { FurniVarBatchRequestBuilder } from './batchBuilder/furniVarBatchRequestBuilder';
import { FurniProfileRequestBuilder } from './profileBuilder/furniProfileRequestBuilder';

/**
 * Allows access to the endpoints for furni variables.
 */
export class FurniVariablesResource extends AbstractVariablesResource {
  constructor(roomId: number, transporter: Transporter) {
    super(roomId, transporter);
  }

  /**
   * Read a single furni variable assignment.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async getVariable(variableName: string, targetKind: FurniTargetKind, furniId: number): Promise<VariableResult> {
    const id = sanitiseFurniId(furniId);
    const data = await this.transporter.get(
      `/api/public/rooms/${this.roomId}/variables/furni/${variableName}/${furniTargetKindKey(targetKind)}/${id}`
    );
    return parseVariableResult(data);
  }

  /**
   * Assign a variable to a furni.
   *
   * This method works similar to `WIRED Effect: Give Variable` with the `Override existing variable` checkbox enabled.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   * @param value (Optional) The value you want to assign to the variable
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async giveVariable(
    variableName: string,
    targetKind: FurniTargetKind,
    furniId: number,
    value: number = -1
  ): Promise<VariableResult> {
    const id = sanitiseFurniId(furniId);
    const data = await this.transporter.put(
      `/api/public/rooms/${this.roomId}/variables/furni/${variableName}/${furniTargetKindKey(targetKind)}/${id}`,
      { value }
    );
    return parseVariableResult(data);
  }

  /**
   * Change the value of an existing furni variable assignment.
   *
   * This method works similar to the `assign` option in `WIRED Effect: Change Variable Value`.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   * @param value The value you want to assign to the variable
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async changeVariable(
    variableName: string,
    targetKind: FurniTargetKind,
    furniId: number,
    value: number
  ): Promise<VariableResult> {
    const id = sanitiseFurniId(furniId);
    const data = await this.transporter.put(
      `/api/public/rooms/${this.roomId}/variables/furni/${variableName}/${furniTargetKindKey(targetKind)}/${id}`,
      { value }
    );
    return parseVariableResult(data);
  }

  /**
   * Remove the variable from the furni.
   *
   * This method works similar to `WIRED Effect: Remove Variable`.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async removeVariable(variableName: string, targetKind: FurniTargetKind, furniId: number): Promise<void> {
    const id = sanitiseFurniId(furniId);
    await this.transporter.delete(
      `/api/public/rooms/${this.roomId}/variables/furni/${variableName}/${furniTargetKindKey(targetKind)}/${id}`
    );
  }

  /**
   * List all furni that hold the variable and their assigned values.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param orderBy (optional) Defines what value the response will be ordered by (default = `OrderBy.CreationTime`)
   * @param orderDir (optional) Defines whether the response is in ascending or descending order (default = `OrderDir.Ascending`)
   * @param page (optional) The page you want to request (default = `1`)
   * @param pageSize (optional) The size of the page (default = `50`)
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async listHolders(
    variableName: string,
    targetKind: FurniTargetKind,
    orderBy: OrderBy = OrderBy.CreationTime,
    orderDir: OrderDir = OrderDir.Ascending,
    page: number = 1,
    pageSize: number = 50
  ): Promise<FurniVariableHoldersResult> {
    const data = await this.transporter.get(
      `/api/public/rooms/${this.roomId}/variables/furni/${variableName}/${furniTargetKindKey(targetKind)}`,
      {
        order_by: orderByKey(orderBy),
        order_dir: orderDirKey(orderDir),
        page,
        size: pageSize,
      }
    );
    return parseFurniVariableHoldersResult(data);
  }

  /**
   * Get the amount of furni that hold the variable.
   *
   * @param variableName The name of the variable
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async countHolders(variableName: string, targetKind: FurniTargetKind): Promise<HolderCountResult> {
    const data = await this.transporter.get(
      `/api/public/rooms/${this.roomId}/variables/furni/${variableName}/${furniTargetKindKey(targetKind)}/count`
    );
    return parseHolderCountResult(data);
  }

  /**
   * Creates a batch request builder, allowing you to give, change or remove the variable to/from
   * multiple furni.
   *
   * @param variableName The name of the variable
   */
  buildBatchRequest(variableName: string): FurniVarBatchRequestBuilder {
    return new FurniVarBatchRequestBuilder(variableName, this.roomId, this.transporter);
  }

  /**
   * List all variables assigned to the furni.
   *
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async getProfile(targetKind: FurniTargetKind, furniId: number): Promise<FurniVariableProfileResult> {
    const id = sanitiseFurniId(furniId);
    const data = await this.transporter.get(
      `/api/public/rooms/${this.roomId}/variables_profile/furni/${furniTargetKindKey(targetKind)}/${id}`
    );
    return parseFurniVariableProfileResult(data);
  }

  /**
   * Change variables assigned to the furni.
   *
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   * @param variables The new values for the variables, use the variable name as the key, assigning null removes the variable
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async changeProfile(
    targetKind: FurniTargetKind,
    furniId: number,
    variables: Record<string, number | null>
  ): Promise<FurniVariableProfileResult> {
    const id = sanitiseFurniId(furniId);
    const data = await this.transporter.patch(
      `/api/public/rooms/${this.roomId}/variables_profile/furni/${furniTargetKindKey(targetKind)}/${id}`,
      { variables }
    );
    return parseFurniVariableProfileResult(data);
  }

  /**
   * Create a profile request builder.
   *
   * @param targetKind The target kind (furni / wall item / BC furni / BC wall item)
   * @param furniId The ID of the furni
   */
  buildChangeProfileRequest(targetKind: FurniTargetKind, furniId: number): FurniProfileRequestBuilder {
    return new FurniProfileRequestBuilder(targetKind, furniId, this.roomId, this.transporter);
  }
}
