export type XmlEventType = 'open' | 'close' | 'complete';

export interface XmlEvent {
  tag: string;
  type: XmlEventType;
  attributes: Record<string, string>;
}

/** Thrown internally when the input cannot be tokenized as (at least loosely) well-formed XML. */
export class XmlParseError extends Error {}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

function decodeXmlEntities(value: string): string {
  return value.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === '#') {
      const codePoint =
        entity[1] === 'x' || entity[1] === 'X'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }
    return NAMED_ENTITIES[entity] ?? match;
  });
}

function parseAttributes(attrString: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const attrRegex = /([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let match: RegExpExecArray | null;
  while ((match = attrRegex.exec(attrString)) !== null) {
    const name = match[1];
    const value = match[2] !== undefined ? match[2] : (match[3] ?? '');
    if (name === undefined) continue;
    // Tag and attribute names are case-folded to uppercase for consistency.
    attributes[name.toUpperCase()] = decodeXmlEntities(value);
  }
  return attributes;
}

/**
 * Strip the XML prolog/declaration, DOCTYPE, comments and CDATA markers, which the tag
 * tokenizer below doesn't need to understand structurally.
 */
function stripNonElementMarkup(xml: string): string {
  return xml
    .replace(/<\?[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, (_match, content: string) => content);
}

const TAG_REGEX = /<(\/)?([A-Za-z_][\w:.-]*)((?:"[^"]*"|'[^']*'|[^"'>])*?)\s*(\/)?>/g;

/**
 * Tokenize an XML document into a flat list of open/close/complete tag events (text/CDATA nodes
 * are not emitted, since `cleanXml()` ignores everything but `open`/`close`/`complete` entries
 * anyway).
 *
 * @throws XmlParseError if the tag nesting is not balanced
 */
export function parseXmlEvents(xml: string): XmlEvent[] {
  const cleaned = stripNonElementMarkup(xml);
  const events: XmlEvent[] = [];
  const stack: string[] = [];

  let match: RegExpExecArray | null;
  TAG_REGEX.lastIndex = 0;
  while ((match = TAG_REGEX.exec(cleaned)) !== null) {
    const isClosing = match[1] === '/';
    const tag = (match[2] ?? '').toUpperCase();
    const attrString = match[3] ?? '';
    const isSelfClosing = match[4] === '/';

    if (isClosing) {
      const openTag = stack.pop();
      if (openTag !== tag) {
        throw new XmlParseError(`Mismatched closing tag </${tag}>`);
      }
      events.push({ tag, type: 'close', attributes: {} });
    } else if (isSelfClosing) {
      events.push({ tag, type: 'complete', attributes: parseAttributes(attrString) });
    } else {
      stack.push(tag);
      events.push({ tag, type: 'open', attributes: parseAttributes(attrString) });
    }
  }

  if (stack.length > 0) {
    throw new XmlParseError(`Unclosed tag(s): ${stack.join(', ')}`);
  }
  if (events.length === 0) {
    throw new XmlParseError('No XML elements found');
  }

  return events;
}

/**
 * Recursively clean up a flat list of parse events into a nested plain-object format: each
 * element becomes an entry in an array keyed by its tag name, and its own attributes are merged
 * together with its children's cleaned result.
 */
function cleanXmlRec(events: XmlEvent[], cursor: { index: number }): Record<string, any[]> {
  const result: Record<string, any[]> = {};

  while (cursor.index < events.length) {
    const entry = events[cursor.index++];
    if (!entry) break;

    switch (entry.type) {
      case 'open': {
        const children = cleanXmlRec(events, cursor);
        const merged = { ...entry.attributes, ...children };
        (result[entry.tag] ??= []).push(merged);
        break;
      }
      case 'close':
        return result;
      case 'complete':
        (result[entry.tag] ??= []).push({ ...entry.attributes });
        break;
      default:
        break;
    }
  }

  return result;
}

/**
 * Clean up a flat list of parsed XML events to the nested object format used by the DataType
 * `parse*` functions.
 */
export function cleanXml(events: XmlEvent[]): Record<string, any[]> {
  return cleanXmlRec(events, { index: 0 });
}

/**
 * Parse a raw XML string straight into the cleaned, nested object shape used by the DataType
 * `parse*` functions. Combines `parseXmlEvents()` and `cleanXml()`.
 *
 * @throws XmlParseError if the input is not well-formed XML
 */
export function parseXml(xml: string): Record<string, any[]> {
  return cleanXml(parseXmlEvents(xml));
}
