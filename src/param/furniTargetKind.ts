export enum FurniTargetKind {
  Furni = 'Furni',
  FurniBC = 'FurniBC',
  WallItems = 'WallItems',
  WallItemsBC = 'WallItemsBC',
}

const FURNI_TARGET_KIND_KEYS: Record<FurniTargetKind, string> = {
  [FurniTargetKind.Furni]: 'furni',
  [FurniTargetKind.FurniBC]: 'furni-bc',
  [FurniTargetKind.WallItems]: 'wall-items',
  [FurniTargetKind.WallItemsBC]: 'wall-items-bc',
};

export function furniTargetKindKey(kind: FurniTargetKind): string {
  return FURNI_TARGET_KIND_KEYS[kind];
}
