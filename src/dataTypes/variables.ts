/**
 * DataTypes for the WIRED variable endpoints, including batch requests, furni variables, global
 * variables and user variables.
 */

/** A variable assignment's data. */
export interface VariableResult {
  /** The value of the variable */
  value: bigint;
  /** The creation time of the variable */
  creationTime: string;
  /** The update time of the variable */
  updateTime: string;
}

export function parseVariableResult(data: any): VariableResult {
  return {
    value: BigInt(data.value),
    creationTime: data.creation_time,
    updateTime: data.update_time,
  };
}

/** A list of all permanent variables in the room. */
export interface VariablesListResult {
  /** The list of permanent user variables in the room */
  users: string[];
  /** The list of permanent furni variables in the room */
  furni: string[];
  /** The list of permanent global variables in the room */
  global: string[];
}

export function parseVariablesListResult(data: any): VariablesListResult {
  return {
    users: data.users,
    furni: data.furni,
    global: data.global,
  };
}

/** The amount of entities that hold a variable. */
export interface HolderCountResult {
  /** The amount of entities that hold a variable */
  count: number;
}

export function parseHolderCountResult(data: any): HolderCountResult {
  return { count: data.count };
}

/** An error that occurred in a batch request. */
export interface BatchError {
  /** The code of the error */
  code: string;
  /** The message of the error */
  message: string;
}

export function parseBatchError(data: any): BatchError {
  return {
    code: data.code,
    message: data.message,
  };
}

/** The result of a single batch request entry. */
export interface BatchResultEntry {
  /** The op ID of the request */
  opId: string;
  /** The status of the request */
  status: number;
  /** The body of the request (null for DELETE or when an error occurs) */
  body: VariableResult | null;
  /** The error if the request failed (null if the request succeeded) */
  error: BatchError | null;
}

export function parseBatchResultEntry(data: any): BatchResultEntry {
  return {
    opId: data.op_id,
    status: data.status,
    body: data.body !== undefined && data.body !== null ? parseVariableResult(data.body) : null,
    error: data.error !== undefined && data.error !== null ? parseBatchError(data.error) : null,
  };
}

/** The result of a batch request. */
export interface BatchResult {
  /** The individual results for each subrequest */
  results: BatchResultEntry[];
}

export function parseBatchResult(data: any): BatchResult {
  return {
    results: (data.results as any[]).map(parseBatchResultEntry),
  };
}

/** A furni holder of a variable. */
export interface FurniHolder {
  /** The ID of the furni */
  id: number;
}

export function parseFurniHolder(data: any): FurniHolder {
  return { id: data.id };
}

function parseOptionalFurniHolder(data: any, key: string): FurniHolder | null {
  return data[key] !== undefined && data[key] !== null ? parseFurniHolder(data[key]) : null;
}

/** A variable assigned to a furni. */
export interface FurniVariableHolder {
  /** The variable data */
  variable: VariableResult;
  /** The floor item data (if the requested furni is a floor item, otherwise null) */
  furni: FurniHolder | null;
  /** The BC floor item data (if the requested furni is a BC floor item, otherwise null) */
  furniBc: FurniHolder | null;
  /** The wall item data (if the requested furni is a wall item, otherwise null) */
  wallItem: FurniHolder | null;
  /** The BC wall item data (if the requested furni is a BC wall item, otherwise null) */
  wallItemBc: FurniHolder | null;
}

export function parseFurniVariableHolder(data: any): FurniVariableHolder {
  return {
    variable: parseVariableResult(data.variable),
    furni: parseOptionalFurniHolder(data, 'furni'),
    furniBc: parseOptionalFurniHolder(data, 'furni_bc'),
    wallItem: parseOptionalFurniHolder(data, 'wall_item'),
    wallItemBc: parseOptionalFurniHolder(data, 'wall_item_bc'),
  };
}

/** A page of furni variable holders. */
export interface FurniVariableHoldersResult {
  /** The furni variable holders */
  items: FurniVariableHolder[];
  /** The current page */
  page: number;
  /** The size of the page */
  size: number;
}

export function parseFurniVariableHoldersResult(data: any): FurniVariableHoldersResult {
  return {
    items: (data.items as any[]).map(parseFurniVariableHolder),
    page: data.page,
    size: data.size,
  };
}

/** A list of variables assigned to a furni. */
export interface FurniVariableProfileResult {
  /** The list of variables assigned to the furni */
  variables: VariableResult[];
  /** The floor item data (if the requested furni is a floor item, otherwise null) */
  furni: FurniHolder | null;
  /** The BC floor item data (if the requested furni is a BC floor item, otherwise null) */
  furniBc: FurniHolder | null;
  /** The wall item data (if the requested furni is a wall item, otherwise null) */
  wallItem: FurniHolder | null;
  /** The BC wall item data (if the requested furni is a BC wall item, otherwise null) */
  wallItemBc: FurniHolder | null;
}

export function parseFurniVariableProfileResult(data: any): FurniVariableProfileResult {
  return {
    variables: (data.variables as any[]).map(parseVariableResult),
    furni: parseOptionalFurniHolder(data, 'furni'),
    furniBc: parseOptionalFurniHolder(data, 'furni_bc'),
    wallItem: parseOptionalFurniHolder(data, 'wall_item'),
    wallItemBc: parseOptionalFurniHolder(data, 'wall_item_bc'),
  };
}

/** A list of permanent global variables in the room. */
export interface GlobalVariableProfileResult {
  /** The list of permanent global variables in the room */
  variables: VariableResult[];
}

export function parseGlobalVariableProfileResult(data: any): GlobalVariableProfileResult {
  return {
    variables: (data.variables as any[]).map(parseVariableResult),
  };
}

/** A bot holder of a variable. */
export interface BotHolder {
  /** The name of the bot */
  name: string;
  /** The ID of the bot */
  id: number;
}

export function parseBotHolder(data: any): BotHolder {
  return { name: data.name, id: data.id };
}

/** A pet holder of a variable. */
export interface PetHolder {
  /** The name of the pet */
  name: string;
  /** The ID of the pet */
  id: number;
}

export function parsePetHolder(data: any): PetHolder {
  return { name: data.name, id: data.id };
}

/** A user holder of a variable. */
export interface UserHolder {
  /** The UUID of the user */
  uniqueId: string;
  /** The name of the user */
  name: string;
  /** The ID of the user */
  id: number;
}

export function parseUserHolder(data: any): UserHolder {
  return {
    uniqueId: data.unique_id,
    name: data.name,
    id: data.id,
  };
}

/** A variable assigned to a user, pet or furni. */
export interface UserVariableHolder {
  /** The variable data */
  variable: VariableResult;
  /** The user data (if the requested entity is a user, otherwise null) */
  user: UserHolder | null;
  /** The pet data (if the requested entity is a pet, otherwise null) */
  pet: PetHolder | null;
  /** The bot data (if the requested entity is a bot, otherwise null) */
  bot: BotHolder | null;
}

export function parseUserVariableHolder(data: any): UserVariableHolder {
  return {
    variable: parseVariableResult(data.variable),
    user: data.user !== undefined && data.user !== null ? parseUserHolder(data.user) : null,
    pet: data.pet !== undefined && data.pet !== null ? parsePetHolder(data.pet) : null,
    bot: data.bot !== undefined && data.bot !== null ? parseBotHolder(data.bot) : null,
  };
}

/** A page of user variable holders. */
export interface UserVariableHoldersResult {
  /** The user variable holders */
  items: UserVariableHolder[];
  /** The current page */
  page: number;
  /** The size of the page */
  size: number;
}

export function parseUserVariableHoldersResult(data: any): UserVariableHoldersResult {
  return {
    items: (data.items as any[]).map(parseUserVariableHolder),
    page: data.page,
    size: data.size,
  };
}

/** A list of variables assigned to a user, pet or bot. */
export interface UserVariableProfileResult {
  /** The list of variables assigned to the user, pet or bot */
  variables: VariableResult[];
  /** The user data (if the requested entity is a user, otherwise null) */
  user: UserHolder | null;
  /** The pet data (if the requested entity is a pet, otherwise null) */
  pet: PetHolder | null;
  /** The bot data (if the requested entity is a bot, otherwise null) */
  bot: BotHolder | null;
}

export function parseUserVariableProfileResult(data: any): UserVariableProfileResult {
  return {
    variables: (data.variables as any[]).map(parseVariableResult),
    user: data.user !== undefined && data.user !== null ? parseUserHolder(data.user) : null,
    pet: data.pet !== undefined && data.pet !== null ? parsePetHolder(data.pet) : null,
    bot: data.bot !== undefined && data.bot !== null ? parseBotHolder(data.bot) : null,
  };
}
