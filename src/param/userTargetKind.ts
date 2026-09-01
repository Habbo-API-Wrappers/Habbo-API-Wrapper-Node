export enum UserTargetKind {
  Users = 'Users',
  Pets = 'Pets',
  Bots = 'Bots',
}

const USER_TARGET_KIND_KEYS: Record<UserTargetKind, string> = {
  [UserTargetKind.Users]: 'users',
  [UserTargetKind.Pets]: 'pets',
  [UserTargetKind.Bots]: 'bots',
};

export function userTargetKindKey(kind: UserTargetKind): string {
  return USER_TARGET_KIND_KEYS[kind];
}
