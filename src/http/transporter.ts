import { HabboApiException } from '../exceptions/habboApiException';
import { parseXml, XmlParseError } from '../util/xmlParser';
import { JSONParse, JSONStringify } from 'json-with-bigint';

/**
 * The `User-Agent` sent with every request.
 */
const USER_AGENT = 'WiredApiWrapper-TS/1.0';

type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * The HTTP transport used by the wrapper.
 *
 * Joins a base URL with a request path, attaches `Accept`/`User-Agent`/`Content-Type` headers
 * plus any additional custom headers (used for the WIRED read/write key headers), encodes
 * request bodies as JSON, and parses responses as either JSON or XML, throwing a
 * {@link HabboApiException} on non-2xx responses or parse failures.
 */
export class Transporter {
  private readonly baseURL: string;

  /**
   * @param baseURL The base URL used (a trailing slash is stripped)
   * @param additionalHeaders Additional headers attached to all requests
   */
  constructor(
    baseURL: string,
    private readonly additionalHeaders: Record<string, string> = {}
  ) {
    this.baseURL = baseURL.replace(/\/+$/, '');
  }

  /**
   * Create a cloned instance of the transporter extended with the given new headers.
   *
   * @param newAdditionalHeaders The headers to add to the cloned instance
   * @returns A new cloned instance of the transporter
   */
  extendWithHeaders(newAdditionalHeaders: Record<string, string>): Transporter {
    return new Transporter(
      this.baseURL,
      { ...this.additionalHeaders, ...newAdditionalHeaders }
    );
  }

  /**
   * Perform a GET request and parse the response as a JSON body.
   *
   * @throws HabboApiException If the API responds with an error, or the response can't be parsed
   */
  async get<T = any>(path: string, query: QueryParams = {}): Promise<T> {
    const request = this.buildRequest('GET', path, undefined, query);
    return this.handleJsonRequest<T>(request);
  }

  /**
   * Perform a GET request and parse the response as an XML body.
   *
   * @throws HabboApiException If the API responds with an error, or the response can't be parsed
   */
  async getXML<T = any>(path: string, query: QueryParams = {}): Promise<T> {
    const request = this.buildRequest('GET', path, undefined, query, 'application/xml');
    return this.handleXmlRequest<T>(request);
  }

  /**
   * Perform a POST request and parse the response as a JSON body.
   *
   * @throws HabboApiException If the API responds with an error, or the response can't be parsed
   */
  async post<T = any>(path: string, requestBody: unknown, query: QueryParams = {}): Promise<T> {
    const request = this.buildRequest('POST', path, requestBody, query);
    return this.handleJsonRequest<T>(request);
  }

  /**
   * Perform a PUT request and parse the response as a JSON body.
   *
   * @throws HabboApiException If the API responds with an error, or the response can't be parsed
   */
  async put<T = any>(path: string, requestBody: unknown, query: QueryParams = {}): Promise<T> {
    const request = this.buildRequest('PUT', path, requestBody, query);
    return this.handleJsonRequest<T>(request);
  }

  /**
   * Perform a PATCH request and parse the response as a JSON body.
   *
   * @throws HabboApiException If the API responds with an error, or the response can't be parsed
   */
  async patch<T = any>(path: string, requestBody: unknown, query: QueryParams = {}): Promise<T> {
    const request = this.buildRequest('PATCH', path, requestBody, query);
    return this.handleJsonRequest<T>(request);
  }

  /**
   * Perform a DELETE request.
   *
   * @throws HabboApiException If the API responds with an error
   */
  async delete(path: string, query: QueryParams = {}): Promise<void> {
    const request = this.buildRequest('DELETE', path, undefined, query);
    await this.handleRawRequest(request);
  }

  private buildUrl(path: string, query: QueryParams): string {
    let url = `${this.baseURL}/${path.replace(/^\/+/, '')}`;
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;
      searchParams.append(key, String(value));
    }
    const queryString = searchParams.toString();
    if (queryString.length > 0) {
      url += `?${queryString}`;
    }
    return url;
  }

  private buildRequest(
    method: string,
    path: string,
    body: unknown,
    query: QueryParams,
    acceptType: string = 'application/json'
  ): { url: string; init: RequestInit } {
    const url = this.buildUrl(path, query);

    const headers: Record<string, string> = {
      Accept: acceptType,
      'User-Agent': USER_AGENT,
    };

    const init: RequestInit = { method, headers };

    const hasBody = body !== undefined && body !== null && !(typeof body === 'object' && Object.keys(body as object).length === 0);
    if (hasBody) {
      try {
        init.body = JSONStringify(body);
      } catch (error) {
        throw new HabboApiException(
          `Failed to encode JSON request body: ${(error as Error).message}`,
          0,
          null,
          error
        );
      }
      headers['Content-Type'] = 'application/json';
    }

    for (const [headerName, headerValue] of Object.entries(this.additionalHeaders)) {
      headers[headerName] = headerValue;
    }

    return { url, init };
  }

  private async handleRawRequest(request: { url: string; init: RequestInit }): Promise<string> {
    const response = await fetch(request.url, request.init);
    const body = await response.text();

    if (response.status < 200 || response.status > 299) {
      throw new HabboApiException(
        `API Request failed with status code ${response.status}: ${response.statusText}`,
        response.status,
        body
      );
    }

    return body;
  }

  private async handleJsonRequest<T>(request: { url: string; init: RequestInit }): Promise<T> {
    const body = await this.handleRawRequest(request);
    const jsonBody = body.length === 0 ? '{}' : body;

    try {
      return JSONParse(jsonBody) as T;
    } catch (error) {
      throw new HabboApiException(
        `Failed to parse JSON response: ${(error as Error).message}`,
        0,
        body,
        error
      );
    }
  }

  private async handleXmlRequest<T>(request: { url: string; init: RequestInit }): Promise<T> {
    const body = await this.handleRawRequest(request);

    try {
      return parseXml(body) as T;
    } catch (error) {
      if (error instanceof XmlParseError) {
        throw new HabboApiException('Failed to parse XML response', 0, body, error);
      }
      throw error;
    }
  }
}
