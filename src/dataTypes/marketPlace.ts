/**
 * DataTypes for the marketplace endpoints.
 */

/** A marketplace history entry. */
export interface MarketPlaceHistory {
  /** How many days in the past this instance is from */
  dayOffset: string;
  /** The average price at this time */
  averagePrice: string;
  /** The total items sold at this time */
  totalSoldItems: string;
  /** The total amount of credits used to buy this item at this time */
  totalCreditSum: string;
  /** The total amount of open offers for this item at this time */
  totalOpenOffers: string;
}

export function parseMarketPlaceHistory(data: any): MarketPlaceHistory {
  return {
    dayOffset: data.dayOffset,
    averagePrice: data.averagePrice,
    totalSoldItems: data.totalSoldItems,
    totalCreditSum: data.totalCreditSum,
    totalOpenOffers: data.totalOpenOffers,
  };
}

/** The marketplace data for an item. */
export interface MarketPlaceItemData {
  /** The classname of the item */
  item: string;
  /** The date that the statistics were last updated */
  statsDate: string;
  /** The sale history of the item */
  history: MarketPlaceHistory[];
  /** The amount of items sold */
  soldItemCount: number;
  /** The amount of credits this item was listed for */
  creditSum: number;
  /** The average price of the item */
  averagePrice: number;
  /** The amount of total open offers of the item */
  totalOpenOffers: number;
  /** The amount of current open offers of the item */
  currentOpenOffers: number;
  /** The current price of the item */
  currentPrice: number;
  /** The limit of the history */
  historyLimitInDays: number;
}

export function parseMarketPlaceItemData(data: any): MarketPlaceItemData {
  return {
    item: data.item,
    statsDate: data.statsDate,
    history: (data.history as any[]).map(parseMarketPlaceHistory),
    soldItemCount: data.soldItemCount,
    creditSum: data.creditSum,
    averagePrice: data.averagePrice,
    totalOpenOffers: data.totalOpenOffers,
    currentOpenOffers: data.currentOpenOffers,
    currentPrice: data.currentPrice,
    historyLimitInDays: data.historyLimitInDays,
  };
}

/** The response of a marketplace batch request. */
export interface MarketPlaceStatsBatchResult {
  /** The status of the request */
  status: string;
  /** The requested floor item data */
  roomItemData: MarketPlaceItemData[];
  /** The requested wall item data */
  wallItemData: MarketPlaceItemData[];
}

export function parseMarketPlaceStatsBatchResult(data: any): MarketPlaceStatsBatchResult {
  return {
    status: data.status,
    roomItemData: (data.roomItemData as any[]).map(parseMarketPlaceItemData),
    wallItemData: (data.wallItemData as any[]).map(parseMarketPlaceItemData),
  };
}
