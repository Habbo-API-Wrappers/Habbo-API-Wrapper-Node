import { AbstractResource } from './abstractResource';
import { Transporter } from '../http/transporter';
import { MarketPlaceStatsBatchResult, parseMarketPlaceStatsBatchResult } from '../dataTypes/marketPlace';

/**
 * Allows access to the endpoints for the marketplace.
 */
export class MarketPlaceResource extends AbstractResource {
  constructor(transporter: Transporter) {
    super(transporter);
  }

  /**
   * Provides statistical data for multiple room and wall items.
   *
   * @param floorItems The classnames of the floor furni you want to request data on
   * @param wallItems The classnames of the wall furni you want to request data on
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async statsBatch(floorItems: string[], wallItems: string[]): Promise<MarketPlaceStatsBatchResult> {
    const body = {
      roomItems: floorItems.map((item) => ({ item })),
      wallItems: wallItems.map((item) => ({ item })),
    };
    const data = await this.transporter.post('/api/public/marketplace/stats/batch', body);
    return parseMarketPlaceStatsBatchResult(data);
  }
}
