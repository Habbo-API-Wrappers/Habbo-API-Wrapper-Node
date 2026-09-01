import { AbstractResource } from './abstractResource';
import { Transporter } from '../http/transporter';
import { BadgeOwnersResult, parseBadgeOwnersResult } from '../dataTypes/badges';

/**
 * Allows access to the endpoints for badges.
 */
export class BadgesResource extends AbstractResource {
  constructor(transporter: Transporter) {
    super(transporter);
  }

  /**
   * Returns the amount of users who own the badge plus localized name/description.
   *
   * @param badgeCode Badge code to query.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async ownerCount(badgeCode: string): Promise<BadgeOwnersResult> {
    const data = await this.transporter.get(`/api/public/badge/owners/${badgeCode}`);
    return parseBadgeOwnersResult(data);
  }
}
