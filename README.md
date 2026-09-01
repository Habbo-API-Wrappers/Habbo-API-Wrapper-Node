# wired-api-wrapper-node

A lightweight TypeScript wrapper for the Habbo public API and WIRED variable endpoints.

## Installation

```bash
npm install wired-api-wrapper-node
```

Requires Node.js >= 18 (for the built-in global `fetch`). There are no runtime dependencies.

## Basic Usage

### Initializing the API Client

Import the primary API class and your desired hotel configuration:

```typescript
import { HabboPublicAPI, Hotel } from 'wired-api-wrapper-node';

// Create an instance targeting the .COM hotel
const api = HabboPublicAPI.fromHotel(Hotel.COM);
```

### Accessing Standard Endpoints

Once instantiated, use the resource methods to query public data, for example:

```typescript
// Fetch achievements list
const achievements = await api.achievements().all();

// Fetch room details by ID
const room = await api.rooms().byId(roomId);
```

## Wired Variables Endpoints

To interact with WIRED variables, call the `variables()` method on your API instance with the
room ID and your read/write keys:

```typescript
const varApi = api.variables(roomId, wiredReadKey, wiredWriteKey);

// Access variable data for the specified room
const allVarNames = await varApi.listAll();
const userVarProfile = await varApi.user().getProfileByUsername('WiredSpast');
```

> **Keep your keys out of source control.** WIRED read/write keys should live in an untracked
> `.env` file (loaded with something like the [`dotenv`](https://www.npmjs.com/package/dotenv)
> package), never hardcoded directly in your source files. See `examples/basicUsage.ts` for the
> pattern - it deliberately uses placeholder key values rather than real ones.

## Error Handling

API requests throw a `HabboApiException` on failure (non-2xx responses, or JSON/XML parsing
failures), and let network/connection errors (DNS failures, timeouts, etc.) from the underlying
`fetch` call propagate unwrapped. Wrap your calls in a `try/catch` block:

```typescript
import { HabboApiException } from 'wired-api-typescript';

try {
  const room = await api.rooms().byId(roomId);
} catch (error) {
  if (error instanceof HabboApiException) {
    // Handle API-specific errors (e.g., 404 Not Found, 500 Server Error)
    console.error(error.statusCode, error.message, error.getResponseBody());
  } else {
    // Handle network or transport issues
    console.error(error);
  }
}
```

## Supported Feature Overview

- **Public Endpoints**:
  - Achievements
  - Badge owner count
  - Groups
  - Marketplace statistics
  - Ping
  - Rooms
  - Lists (hot looks)
  - Users
- **Variable Endpoints**:
  - Read and manage permanent user variables
  - Read and manage permanent furni variables
  - Read and manage permanent global variables
- **Level-up System add-on**: `LevelUpper.linear()`, `LevelUpper.interpolate()` and
  `LevelUpper.exponential()` mimic the WIRED Variable Add-on's level math.

## License

MIT - see [LICENSE](./LICENSE).
