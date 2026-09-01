import { AbstractVariablesResource } from './abstractVariablesResource';
import { Transporter } from '../../http/transporter';
import { VariablesListResult, parseVariablesListResult } from '../../dataTypes/variables';
import { UserVariablesResource } from './userVariablesResource';
import { FurniVariablesResource } from './furniVariablesResource';
import { GlobalVariablesResource } from './globalVariablesResource';

/**
 * Allows access to the endpoints for variables for a specified room.
 *
 * Obtained via `HabboPublicAPI.variables(roomId, wiredReadKey, wiredWriteKey)`.
 */
export class VariablesResource extends AbstractVariablesResource {
  private userVariablesResource: UserVariablesResource | null = null;
  private furniVariablesResource: FurniVariablesResource | null = null;
  private globalVariablesResource: GlobalVariablesResource | null = null;

  constructor(roomId: number, transporter: Transporter) {
    super(roomId, transporter);
  }

  /**
   * List the names of all permanent variables in the room.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async listAll(): Promise<VariablesListResult> {
    const data = await this.transporter.get(`/api/public/rooms/${this.roomId}/variables`);
    return parseVariablesListResult(data);
  }

  /**
   * Delete all variable assignments for the given variables.
   *
   * @param varNames The variable names to remove
   * @returns Whether the variable assignments have been removed
   */
  async bulkDelete(...varNames: string[]): Promise<boolean> {
    try {
      await this.transporter.post(`/api/public/rooms/${this.roomId}/variables/bulk-delete`, {
        variables: varNames,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Access the endpoints related to user variables.
   */
  user(): UserVariablesResource {
    return (this.userVariablesResource ??= new UserVariablesResource(this.roomId, this.transporter));
  }

  /**
   * Access the endpoints related to furni variables.
   */
  furni(): FurniVariablesResource {
    return (this.furniVariablesResource ??= new FurniVariablesResource(this.roomId, this.transporter));
  }

  /**
   * Access the endpoints related to global variables.
   */
  global(): GlobalVariablesResource {
    return (this.globalVariablesResource ??= new GlobalVariablesResource(this.roomId, this.transporter));
  }
}
