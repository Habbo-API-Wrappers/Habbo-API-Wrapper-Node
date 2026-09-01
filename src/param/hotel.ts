/**
 * The official Habbo hotels.
 */
export enum Hotel {
  BR = 'BR',
  COM = 'COM',
  DE = 'DE',
  ES = 'ES',
  FI = 'FI',
  FR = 'FR',
  IT = 'IT',
  NL = 'NL',
  S2 = 'S2',
  TR = 'TR',
}

const HOTEL_DOMAINS: Record<Hotel, string> = {
  [Hotel.BR]: 'https://www.habbo.com.br/',
  [Hotel.COM]: 'https://www.habbo.com/',
  [Hotel.DE]: 'https://www.habbo.de/',
  [Hotel.ES]: 'https://www.habbo.es/',
  [Hotel.FI]: 'https://www.habbo.fi/',
  [Hotel.FR]: 'https://www.habbo.fr/',
  [Hotel.IT]: 'https://www.habbo.it/',
  [Hotel.NL]: 'https://www.habbo.nl/',
  [Hotel.S2]: 'https://sandbox.habbo.com/',
  [Hotel.TR]: 'https://www.habbo.com.tr/',
};

/**
 * Get the base URL of the hotel (including scheme and trailing slash).
 */
export function getHotelDomain(hotel: Hotel): string {
  return HOTEL_DOMAINS[hotel];
}
