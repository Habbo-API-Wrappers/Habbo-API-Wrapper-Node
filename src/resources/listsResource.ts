import { AbstractResource } from './abstractResource';
import { Transporter } from '../http/transporter';
import { HotLooksResult, parseHotLooksResult } from '../dataTypes/lists';

/**
 * Allows access to the endpoints for lists.
 */
export class ListsResource extends AbstractResource {
  constructor(transporter: Transporter) {
    super(transporter);
  }

  /**
   * Retrieves a list of popular avatars' "hot looks". This is the one endpoint in the public API
   * that responds with XML rather than JSON.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async hotLooks(): Promise<HotLooksResult> {
    const data = await this.transporter.getXML('/api/public/lists/hotlooks');
    return parseHotLooksResult(data);
  }
}
