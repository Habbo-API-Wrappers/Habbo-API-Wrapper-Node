import { Transporter } from './http/transporter';
import { Hotel, getHotelDomain } from './param/hotel';
import { AchievementsResource } from './resources/achievementsResource';
import { BadgesResource } from './resources/badgesResource';
import { GroupsResource } from './resources/groupsResource';
import { ListsResource } from './resources/listsResource';
import { MarketPlaceResource } from './resources/marketPlaceResource';
import { RoomsResource } from './resources/roomsResource';
import { UsersResource } from './resources/usersResource';
import { VariablesResource } from './resources/variables/variablesResource';

/**
 * The main entry point of the wrapper.
 *
 * Create an instance with {@link HabboPublicAPI.fromHotel}, then use the lazily-cached resource
 * accessor methods to reach the various endpoint groups.
 */
export class HabboPublicAPI {
  private achievementsResource: AchievementsResource | null = null;
  private badgesResource: BadgesResource | null = null;
  private groupsResource: GroupsResource | null = null;
  private marketplaceResource: MarketPlaceResource | null = null;
  private roomsResource: RoomsResource | null = null;
  private listsResource: ListsResource | null = null;
  private usersResource: UsersResource | null = null;

  private constructor(private readonly transporter: Transporter) {}

  /**
   * Create an API wrapper for the given hotel.
   *
   * @param hotel The hotel to target
   */
  static fromHotel(hotel: Hotel): HabboPublicAPI {
    const baseURL = getHotelDomain(hotel);
    const transporter = new Transporter(baseURL, {});
    return new HabboPublicAPI(transporter);
  }

  /** Access the achievement related endpoints. */
  achievements(): AchievementsResource {
    return (this.achievementsResource ??= new AchievementsResource(this.transporter));
  }

  /** Access the badge related endpoints. */
  badges(): BadgesResource {
    return (this.badgesResource ??= new BadgesResource(this.transporter));
  }

  /** Access the group related endpoints. */
  groups(): GroupsResource {
    return (this.groupsResource ??= new GroupsResource(this.transporter));
  }

  /** Access the marketplace related endpoints. */
  marketplace(): MarketPlaceResource {
    return (this.marketplaceResource ??= new MarketPlaceResource(this.transporter));
  }

  /** Access the room related endpoints. */
  rooms(): RoomsResource {
    return (this.roomsResource ??= new RoomsResource(this.transporter));
  }

  /** Access the list related endpoints. */
  lists(): ListsResource {
    return (this.listsResource ??= new ListsResource(this.transporter));
  }

  /** Access the user related endpoints. */
  users(): UsersResource {
    return (this.usersResource ??= new UsersResource(this.transporter));
  }

  /**
   * Create a wrapper to access the WIRED variable endpoints for a specified room.
   *
   * @param roomId The ID of the room
   * @param wiredReadKey The wired read header key
   * @param wiredWriteKey The wired write header key
   */
  variables(roomId: number, wiredReadKey: string, wiredWriteKey: string): VariablesResource {
    return new VariablesResource(
      roomId,
      this.transporter.extendWithHeaders({
        'X-Wired-Read-Key': wiredReadKey,
        'X-Wired-Write-Key': wiredWriteKey,
      })
    );
  }

  /**
   * Checks if the backend is available.
   *
   * @returns Whether the backend is available or not.
   */
  async ping(): Promise<boolean> {
    try {
      await this.transporter.get('/api/public/ping');
      return true;
    } catch {
      return false;
    }
  }
}
