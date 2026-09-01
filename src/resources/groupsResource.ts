import { AbstractResource } from './abstractResource';
import { Transporter } from '../http/transporter';
import {
  GroupMembersResult,
  parseGroupMembersResult,
  GroupResult,
  parseGroupResult,
} from '../dataTypes/groups';

/**
 * Allows access to the endpoints for groups.
 */
export class GroupsResource extends AbstractResource {
  constructor(transporter: Transporter) {
    super(transporter);
  }

  /**
   * Retrieves detailed information about a specific group identified by its unique ID.
   *
   * @param groupId The unique ID of the group to retrieve.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async byId(groupId: string): Promise<GroupResult> {
    const data = await this.transporter.get(`/api/public/groups/${groupId}`);
    return parseGroupResult(data);
  }

  /**
   * Retrieves a list of members for a specified group, including details.
   *
   * @param groupId The unique ID of the group whose members are to be retrieved.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async membersById(groupId: string): Promise<GroupMembersResult> {
    const data = await this.transporter.get(`/api/public/groups/${groupId}/members`);
    return parseGroupMembersResult(data);
  }
}
