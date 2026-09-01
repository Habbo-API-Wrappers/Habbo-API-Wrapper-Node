/**
 * DataTypes for the rooms endpoints.
 */

/** The door mode of a room. */
export enum RoomDoorMode {
  /** The room is open, anyone can enter */
  Open = 'Open',
  /** The room is locked, users without rights and not in the group have to ring the bell */
  Closed = 'Closed',
  /** The room is locked, users without rights and not in the group have to enter the correct password */
  Password = 'Password',
  /** The room is locked for users the owner is not friends with */
  Friends = 'Friends',
}

export function roomDoorModeFromString(s: string): RoomDoorMode {
  switch (s) {
    case 'closed':
      return RoomDoorMode.Closed;
    case 'password':
      return RoomDoorMode.Password;
    case 'friends':
      return RoomDoorMode.Friends;
    default:
      return RoomDoorMode.Open;
  }
}

/** A Habbo room. */
export interface RoomResult {
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
  /** Whether the owner name is shown in game */
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
  /** Whether the room is a public room */
  publicRoom: boolean;
  /** The door mode of the room */
  doorMode: RoomDoorMode;
  /** The UUID of the room */
  uniqueId: string;
}

export function parseRoomResult(data: any): RoomResult {
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
    publicRoom: data.publicRoom,
    doorMode: roomDoorModeFromString(data.doorMode),
    uniqueId: data.uniqueId,
  };
}
