/**
 * Sanitises a furni ID
 *
 * @param furniId The furni ID to sanitise
 * @returns The sanitised furni ID
 */
export function sanitiseFurniId(furniId: number): number {
  let id = furniId;
  if (id < 0) id *= -1;
  if (id >= 2147418112) id -= 2147418112;
  return id;
}
