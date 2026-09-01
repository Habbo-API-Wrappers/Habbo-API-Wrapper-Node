/**
 * DataTypes for the lists endpoints.
 */

/** A hot look. */
export interface HotLook {
  /** The gender of the outfit */
  gender: string;
  /** The figure string of the outfit */
  figure: string;
  /** The hash of the outfit */
  hash: string;
}

export function parseHotLook(data: any): HotLook {
  return {
    gender: data.GENDER,
    figure: data.FIGURE,
    hash: data.HASH,
  };
}

/** The list of current hot looks. */
export interface HotLooksResult {
  /** The requested URL */
  url: string;
  /** The list of hot looks */
  looks: HotLook[];
}

export function parseHotLooksResult(data: any): HotLooksResult {
  const habbos = data.HABBOS[0];
  return {
    url: habbos.URL,
    looks: (habbos.HABBO as any[]).map(parseHotLook),
  };
}
