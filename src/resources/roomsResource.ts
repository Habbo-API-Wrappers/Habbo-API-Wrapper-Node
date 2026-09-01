import { AbstractResource } from './abstractResource';
import { Transporter } from '../http/transporter';
import { RoomResult, parseRoomResult } from '../dataTypes/rooms';

/**
 * Allows access to the endpoints for rooms.
 */
export class RoomsResource extends AbstractResource {
  constructor(transporter: Transporter) {
    super(transporter);
  }

  /**
   * Fetches detailed information about a public room identified by its unique ID. The room
   * details are returned if the room is found.
   *
   * @param roomId The ID of the room to retrieve information for.
   *
   * @throws HabboApiException If the API throws an error or exception
   */
  async byId(roomId: number): Promise<RoomResult> {
    const data = await this.transporter.get(`/api/public/rooms/${roomId}`);
    return parseRoomResult(data);
  }
}
