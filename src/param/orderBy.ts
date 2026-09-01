export enum OrderBy {
  Value = 'Value',
  CreationTime = 'CreationTime',
  UpdateTime = 'UpdateTime',
}

const ORDER_BY_KEYS: Record<OrderBy, string> = {
  [OrderBy.Value]: 'value',
  [OrderBy.CreationTime]: 'creation_time',
  [OrderBy.UpdateTime]: 'update_time',
};

export function orderByKey(orderBy: OrderBy): string {
  return ORDER_BY_KEYS[orderBy];
}
