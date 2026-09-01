/**
 * DataTypes for the achievements endpoints.
 */

/** The state of an achievement. */
export enum AchievementState {
  Enabled = 'Enabled',
  OffSeason = 'OffSeason',
  Archived = 'Archived',
}

export function achievementStateFromString(s: string): AchievementState {
  switch (s) {
    case 'ENABLED':
      return AchievementState.Enabled;
    case 'OFF_SEASON':
      return AchievementState.OffSeason;
    default:
      return AchievementState.Archived;
  }
}

/** The metadata of an achievement. */
export interface AchievementData {
  /** The ID of the achievement */
  id: number;
  /** The name of the achievement */
  name: string;
  /** The creation time of the achievement */
  creationTime: string;
  /** The state of the achievement */
  state: AchievementState;
  /** The category of the achievement */
  category: string;
}

export function parseAchievementData(data: any): AchievementData {
  return {
    id: data.id,
    name: data.name,
    creationTime: data.creationTime,
    state: achievementStateFromString(data.state),
    category: data.category,
  };
}

/** The required score for a level of an achievement. */
export interface LevelRequirement {
  /** The level */
  level: number;
  /** The required score */
  requiredScore: number;
}

export function parseLevelRequirement(data: any): LevelRequirement {
  return {
    level: data.level,
    requiredScore: data.requiredScore,
  };
}

/** An achievement and its level requirements. */
export interface Achievement {
  /** The metadata of the achievement */
  achievement: AchievementData;
  /** The level requirements of the achievement */
  levelRequirements: LevelRequirement[];
}

export function parseAchievement(data: any): Achievement {
  return {
    achievement: parseAchievementData(data.achievement),
    levelRequirements: (data.levelRequirements as any[]).map(parseLevelRequirement),
  };
}

/** A list of achievements. */
export interface AchievementsResult {
  /** The achievements */
  achievements: Achievement[];
}

export function parseAchievementsResult(data: any): AchievementsResult {
  return {
    achievements: (data as any[]).map(parseAchievement),
  };
}

/** An achievement held by a user. */
export interface UserAchievement {
  /** The achievement's metadata */
  achievement: AchievementData;
  /** The user's current level for the achievement */
  level: number;
  /** The user's current score for the achievement */
  score: number;
}

export function parseUserAchievement(data: any): UserAchievement {
  return {
    achievement: parseAchievementData(data.achievement),
    level: data.level,
    score: data.score,
  };
}

/** A list of user achievements. */
export interface UserAchievementsResult {
  /** A list of user achievements */
  achievements: UserAchievement[];
}

export function parseUserAchievementsResult(data: any): UserAchievementsResult {
  return {
    achievements: (data as any[]).map(parseUserAchievement),
  };
}
