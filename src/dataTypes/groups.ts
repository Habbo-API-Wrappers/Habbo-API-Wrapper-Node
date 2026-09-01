/**
 * DataTypes for the top-level groups endpoints.
 */

/** The access type of the group. */
export enum GroupType {
  /** The group is open, anyone can join */
  Normal = 'Normal',
  /** The group is locked, users can request to join, admins can accept new members */
  Exclusive = 'Exclusive',
  /** The group is locked, nobody can join */
  Closed = 'Closed',
}

export function groupTypeFromString(type: string): GroupType {
  switch (type) {
    case 'EXCLUSIVE':
      return GroupType.Exclusive;
    case 'CLOSED':
      return GroupType.Closed;
    default:
      return GroupType.Normal;
  }
}

/** A member of a group. */
export interface GroupMember {
  /** Whether the user is online */
  online: boolean;
  /** The gender of the user */
  gender: string;
  /** The motto of the user */
  motto: string;
  /** The figure string of the user */
  habboFigure: string;
  /** When the user created their account */
  memberSince: string;
  /** The UUID of the user */
  uniqueId: string;
  /** The name of the user */
  name: string;
  /** Whether the user is an admin of the group */
  isAdmin: boolean;
}

export function parseGroupMember(data: any): GroupMember {
  return {
    online: data.online,
    gender: data.gender,
    motto: data.motto,
    habboFigure: data.habboFigure,
    memberSince: data.memberSince,
    uniqueId: data.uniqueId,
    name: data.name,
    isAdmin: data.isAdmin,
  };
}

/** A list of group members. */
export interface GroupMembersResult {
  /** The list of group members */
  members: GroupMember[];
}

export function parseGroupMembersResult(data: any): GroupMembersResult {
  return {
    members: (data as any[]).map(parseGroupMember),
  };
}

/** A Habbo group. */
export interface GroupResult {
  /** The ID of the group */
  id: string;
  /** The name of the group */
  name: string;
  /** The description of the group */
  description: string;
  /** The access type of the group */
  type: GroupType;
  /** The room ID of the group room */
  roomId: string;
  /** The badge code */
  badgeCode: string;
  /** The primary colour of the group */
  primaryColour: string;
  /** The secondary colour of the group */
  secondaryColour: string;
}

export function parseGroupResult(data: any): GroupResult {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    type: groupTypeFromString(data.type),
    roomId: data.roomId,
    badgeCode: data.badgeCode,
    primaryColour: data.primaryColour,
    secondaryColour: data.secondaryColour,
  };
}
