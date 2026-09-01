import { AbstractResource } from './abstractResource';
import { Transporter } from '../http/transporter';
import {
  AchievementsResult,
  parseAchievementsResult,
  UserAchievementsResult,
  parseUserAchievementsResult,
} from '../dataTypes/achievements';

/**
 * Allows access to the endpoints for achievements.
 */
export class AchievementsResource extends AbstractResource {
  constructor(transporter: Transporter) {
    super(transporter);
  }

  /**
   * Retrieves a list of all achievements including their details and level requirements.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async all(): Promise<AchievementsResult> {
    const data = await this.transporter.get('/api/public/achievements');
    return parseAchievementsResult(data);
  }

  /**
   * Retrieves a list of achievements for a user based on their unique ID.
   *
   * @param id The unique ID of the user whose achievements are to be retrieved.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async forUser(id: string): Promise<UserAchievementsResult> {
    const data = await this.transporter.get(`/api/public/achievements/${id}`);
    return parseUserAchievementsResult(data);
  }
}
