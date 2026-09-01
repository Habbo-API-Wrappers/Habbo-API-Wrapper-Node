export enum OrderDir {
  Ascending = 'Ascending',
  Descending = 'Descending',
}

const ORDER_DIR_KEYS: Record<OrderDir, string> = {
  [OrderDir.Ascending]: 'asc',
  [OrderDir.Descending]: 'desc',
};

export function orderDirKey(orderDir: OrderDir): string {
  return ORDER_DIR_KEYS[orderDir];
}
