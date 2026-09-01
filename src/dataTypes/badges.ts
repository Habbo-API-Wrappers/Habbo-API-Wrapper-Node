/**
 * DataTypes for the top-level badges endpoints.
 */

/** The badge owner count. */
export interface BadgeOwnersResult {
  /** The amount of users that have the badge */
  ownerCount: number;
  /** The name of the badge */
  name: string;
  /** The description of the badge */
  description: string;
}

export function parseBadgeOwnersResult(data: any): BadgeOwnersResult {
  return {
    ownerCount: data.ownerCount,
    name: data.name,
    description: data.description,
  };
}
