/**
 * A small, self-contained example showing the most common ways to use `wired-api-typescript`.
 */

import { HabboPublicAPI, Hotel, HabboApiException, FurniTargetKind, UserTargetKind } from '../src';

async function main() {
  // Create an instance targeting the .COM hotel.
  const api = HabboPublicAPI.fromHotel(Hotel.COM);

  // Check that the backend is reachable.
  const isUp = await api.ping();
  console.log('Habbo public API reachable:', isUp);

  try {
    // Fetch the full achievements list.
    const achievements = await api.achievements().all();
    console.log(`Loaded ${achievements.achievements.length} achievements.`);

    // Look up a user by name, then fetch one of their rooms.
    const user = await api.users().byName('WiredSpast');
    console.log(`${user.name} (${user.uniqueId}) - level ${user.currentLevel ?? 'hidden'}`);

    const rooms = await api.users().rooms(user.uniqueId);
    if (rooms.rooms.length > 0) {
      const room = await api.rooms().byId(rooms.rooms[0]!.id);
      console.log(`First room: "${room.name}" (rating: ${room.rating})`);
    }

    // Fetch the current "hot looks" list (the one XML endpoint in the public API).
    const hotLooks = await api.lists().hotLooks();
    console.log(`Loaded ${hotLooks.looks.length} hot looks from ${hotLooks.url}`);
  } catch (error) {
    if (error instanceof HabboApiException) {
      // Handle API-specific errors (e.g. 404 Not Found, 500 Server Error).
      console.error(`Habbo API error (status ${error.statusCode}): ${error.message}`);
      console.error('Response body:', error.getResponseBody());
    } else {
      // Handle network or transport issues (e.g. DNS failures, timeouts).
      console.error('Failed to reach the Habbo API:', error);
    }
  }

  // --- WIRED variable endpoints -------------------------------------------------------------
  //
  // IMPORTANT: never hardcode real WIRED read/write keys in source. Keep them in an untracked
  // `.env` file (see `.gitignore`) and load them with something like the `dotenv` package, e.g.:
  //
  //   import 'dotenv/config';
  //   const wiredReadKey = process.env.WIRED_READ_KEY!;
  //   const wiredWriteKey = process.env.WIRED_WRITE_KEY!;
  //
  // The placeholders below are only there to illustrate the shape of the call.
  const roomId = 123456789;
  const wiredReadKey = 'YOUR_WIRED_READ_KEY';
  const wiredWriteKey = 'YOUR_WIRED_WRITE_KEY';

  const varApi = api.variables(roomId, wiredReadKey, wiredWriteKey);

  // List every permanent variable name known in the room.
  const allVarNames = await varApi.listAll();
  console.log(allVarNames);

  // Read a user's whole variable profile by username.
  const userVarProfile = await varApi.user().getProfileByUsername('WiredSpast');
  console.log(userVarProfile);

  // Give/change a single furni variable, and read it back.
  await varApi.furni().giveVariable('my_var', FurniTargetKind.Furni, 12345, 1);
  const furniVar = await varApi.furni().getVariable('my_var', FurniTargetKind.Furni, 12345);
  console.log(furniVar);

  // Build and execute a batch of user variable operations in one request.
  const batchResult = await varApi
    .user()
    .buildBatchRequest('my_var')
    .giveVariable('op-1', UserTargetKind.Users, 111, 1)
    .changeVariable('op-2', UserTargetKind.Users, 222, 5)
    .removeVariable('op-3', UserTargetKind.Users, 333)
    .executeRequest();
  console.log(batchResult);
}

main().catch((error) => {
  console.error('Unhandled error:', error);
});
