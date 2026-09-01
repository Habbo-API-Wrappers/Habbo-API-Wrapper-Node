import { AbstractResource } from './abstractResource';
import { Transporter } from '../http/transporter';
import {
  UserBadgesResult,
  parseUserBadgesResult,
  UserFriendsResult,
  parseUserFriendsResult,
  UserGroupsResult,
  parseUserGroupsResult,
  UserRoomsResult,
  parseUserRoomsResult,
  UserProfileResult,
  parseUserProfileResult,
  UserResult,
  parseUserResult,
} from '../dataTypes/users';

/**
 * Allows access to the endpoints for users.
 */
export class UsersResource extends AbstractResource {
  constructor(transporter: Transporter) {
    super(transporter);
  }

  /**
   * Retrieve user information by name. Less information is shown for users with limited profile
   * visibility.
   *
   * @param name The unique name of the user to retrieve information for
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async byName(name: string): Promise<UserResult> {
    const data = await this.transporter.get('/api/public/users', { name });
    return parseUserResult(data);
  }

  /**
   * Retrieves detailed public information about a user by their unique ID. Less information is
   * shown for users with limited profile visibility.
   *
   * @param uniqueId The unique ID of the user to retrieve information for
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async byUniqueId(uniqueId: string): Promise<UserResult> {
    const data = await this.transporter.get(`/api/public/users/${uniqueId}`);
    return parseUserResult(data);
  }

  /**
   * Fetches a list of friends for a user identified by their unique ID. The friends list is only
   * returned if the user is found and the profile is visible.
   *
   * @param uniqueId The unique ID of the user whose friends list is being requested
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async friends(uniqueId: string): Promise<UserFriendsResult> {
    const data = await this.transporter.get(`/api/public/users/${uniqueId}/friends`);
    return parseUserFriendsResult(data);
  }

  /**
   * Fetches a list of groups that a user is a member of, identified by their unique ID.
   *
   * @param uniqueId The unique ID of the user whose groups list is being requested
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async groups(uniqueId: string): Promise<UserGroupsResult> {
    const data = await this.transporter.get(`/api/public/users/${uniqueId}/groups`);
    return parseUserGroupsResult(data);
  }

  /**
   * Fetches a list of public rooms that a user owns, identified by their unique ID.
   *
   * @param uniqueId The unique ID of the user whose rooms list is being requested
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async rooms(uniqueId: string): Promise<UserRoomsResult> {
    const data = await this.transporter.get(`/api/public/users/${uniqueId}/rooms`);
    return parseUserRoomsResult(data);
  }

  /**
   * Fetches a list of badges that a user has earned, identified by their unique ID.
   *
   * @param uniqueId The unique ID of the user whose badge list is being requested
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async badges(uniqueId: string): Promise<UserBadgesResult> {
    const data = await this.transporter.get(`/api/public/users/${uniqueId}/badges`);
    return parseUserBadgesResult(data);
  }

  /**
   * Fetches detailed profile information for a user identified by their unique ID.
   *
   * @param uniqueId The unique ID of the user whose profile is being requested
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async profile(uniqueId: string): Promise<UserProfileResult> {
    const data = await this.transporter.get(`/api/public/users/${uniqueId}/profile`);
    return parseUserProfileResult(data);
  }
}
