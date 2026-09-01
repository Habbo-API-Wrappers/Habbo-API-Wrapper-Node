/**
 * DataTypes for the users endpoints, including a user's badges, friends, groups and rooms.
 */

import { GroupType, groupTypeFromString } from './groups';

/** A badge worn by a user. */
export interface SelectedBadge {
  /** The index that the badge appears at */
  badgeIndex: number;
  /** The code of the badge */
  code: string;
  /** The name of the badge */
  name: string;
  /** The description of the badge */
  description: string;
}

export function parseSelectedBadge(data: any): SelectedBadge {
  return {
    badgeIndex: data.badgeIndex,
    code: data.code,
    name: data.name,
    description: data.description,
  };
}

/** A Habbo badge earned by a user. */
export interface Badge {
  /** The code of the badge */
  code: string;
  /** The name of the badge */
  name: string;
  /** The description of the badge */
  description: string;
}

export function parseBadge(data: any): Badge {
  return {
    code: data.code,
    name: data.name,
    description: data.description,
  };
}

/** The list of badges obtained by a user. */
export interface UserBadgesResult {
  /** The list of badges obtained by the user */
  badges: Badge[];
}

export function parseUserBadgesResult(data: any): UserBadgesResult {
  return {
    badges: (data as any[]).map(parseBadge),
  };
}

/** A Habbo friend. */
export interface Friend {
  /** The UUID of the friend */
  uniqueId: string;
  /** The name of the friend */
  name: string;
  /** The motto of the friend */
  motto: string;
  /** Whether the friend is online */
  online: boolean;
  /** The figure string of the friend */
  figureString: string;
}

export function parseFriend(data: any): Friend {
  return {
    uniqueId: data.uniqueId,
    name: data.name,
    motto: data.motto,
    online: data.online,
    figureString: data.figureString,
  };
}

/** A list of friends of a user. */
export interface UserFriendsResult {
  /** The list of friends of the user */
  friends: Friend[];
}

export function parseUserFriendsResult(data: any): UserFriendsResult {
  return {
    friends: (data as any[]).map(parseFriend),
  };
}

/** A Habbo group requested through a user. */
export interface Group {
  /** Whether the user is online */
  online: boolean;
  /** The UUID of the group */
  id: string;
  /** The name of the group */
  name: string;
  /** The description of the group */
  description: string;
  /** The access type of the group */
  type: GroupType;
  /** The badge code of the group */
  badgeCode: string;
  /** The UUID of the group room */
  roomId: string;
  /** The primary colour of the group */
  primaryColour: string;
  /** The secondary colour of the group */
  secondaryColour: string;
  /** Whether the user is an admin of the group */
  isAdmin: boolean;
}

export function parseGroup(data: any): Group {
  return {
    online: data.online,
    id: data.id,
    name: data.name,
    description: data.description,
    type: groupTypeFromString(data.type),
    badgeCode: data.badgeCode,
    roomId: data.roomId,
    primaryColour: data.primaryColour,
    secondaryColour: data.secondaryColour,
    isAdmin: data.isAdmin,
  };
}

/** A list of groups that a user is in. */
export interface UserGroupsResult {
  /** The list of groups that the user is in */
  groups: Group[];
}

export function parseUserGroupsResult(data: any): UserGroupsResult {
  return {
    groups: (data as any[]).map(parseGroup),
  };
}

/** A room owned by a user. */
export interface Room {
  /** The ID of the room */
  id: number;
  /** The name of the room */
  name: string;
  /** The description of the room */
  description: string;
  /** When the room was created */
  creationTime: string;
  /** The UUID of the group linked to the room if it exists */
  habboGroupId: string | null;
  /** The tags assigned to the room */
  tags: string[];
  /** The maximum amount of visitors allowed in the room */
  maximumVisitors: number;
  /** Whether the owner's name shows in game */
  showOwnerName: boolean;
  /** The name of the room owner */
  ownerName: string;
  /** The UUID of the room owner */
  ownerUniqueId: string;
  /** The categories assigned to the room */
  categories: string[];
  /** The URL to the thumbnail of the room */
  thumbnailUrl: string;
  /** The URL to a rendered image of the room */
  imageUrl: string;
  /** The rating of the room */
  rating: number;
  /** The UUID of the room */
  uniqueId: string;
}

export function parseRoom(data: any): Room {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    creationTime: data.creationTime,
    habboGroupId: data.habboGroupId ?? null,
    tags: data.tags,
    maximumVisitors: data.maximumVisitors,
    showOwnerName: data.showOwnerName,
    ownerName: data.ownerName,
    ownerUniqueId: data.ownerUniqueId,
    categories: data.categories,
    thumbnailUrl: data.thumbnailUrl,
    imageUrl: data.imageUrl,
    rating: data.rating,
    uniqueId: data.uniqueId,
  };
}

/** A list of rooms owned by a user. */
export interface UserRoomsResult {
  /** The list of the rooms owned by the user */
  rooms: Room[];
}

export function parseUserRoomsResult(data: any): UserRoomsResult {
  return {
    rooms: (data as any[]).map(parseRoom),
  };
}

/** A user's profile. */
export interface UserResult {
  /** The UUID of the user */
  uniqueId: string;
  /** The name of the user */
  name: string;
  /** The figure string of the user */
  figureString: string;
  /** The motto of the user */
  motto: string;
  /** Whether the user is online or not (null if the profile is private) */
  online: boolean | null;
  /** When the user last logged in (null if the profile is private) */
  lastAccessTime: string | null;
  /** When the user created their account (null if the profile is private) */
  memberSince: string | null;
  /** Whether the profile is visible (the profile is private if it is false) */
  profileVisible: boolean;
  /** The current level of the user (null if the profile is private) */
  currentLevel: number | null;
  /** The user's progress to the next level (null if the profile is private) */
  currentLevelCompletePercent: number | null;
  /** The total experience points of the user (null if the profile is private) */
  totalExperience: number | null;
  /** The amount of star gems the user has received (null if the profile is private) */
  starGemCount: number | null;
  /** The badges the user is wearing (empty if the profile is private) */
  selectedBadges: SelectedBadge[];
}

export function parseUserResult(data: any): UserResult {
  return {
    uniqueId: data.uniqueId,
    name: data.name,
    figureString: data.figureString,
    motto: data.motto,
    online: data.online ?? null,
    lastAccessTime: data.lastAccessTime ?? null,
    memberSince: data.memberSince ?? null,
    profileVisible: data.profileVisible,
    currentLevel: data.currentLevel ?? null,
    currentLevelCompletePercent: data.currentLevelCompletePercent ?? null,
    totalExperience: data.totalExperience ?? null,
    starGemCount: data.starGemCount ?? null,
    selectedBadges: (data.selectedBadges as any[]).map(parseSelectedBadge),
  };
}

/** A user's extended profile. */
export interface UserProfileResult {
  /** The user's base profile */
  user: UserResult;
  /** The user's groups */
  groups: Group[];
  /** The user's badges */
  badges: Badge[];
  /** The user's friends */
  friends: Friend[];
  /** The user's rooms */
  rooms: Room[];
}

export function parseUserProfileResult(data: any): UserProfileResult {
  return {
    user: parseUserResult(data.user),
    groups: (data.groups as any[]).map(parseGroup),
    badges: (data.badges as any[]).map(parseBadge),
    friends: (data.friends as any[]).map(parseFriend),
    rooms: (data.rooms as any[]).map(parseRoom),
  };
}
