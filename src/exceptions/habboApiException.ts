/**
 * An exception thrown by the Habbo API or the wrapper.
 *
 * Carries the HTTP status code, the raw response body (if the API replied), and an optional
 * wrapped cause.
 */
export class HabboApiException extends Error {
  /**
   * @param message The message of the exception
   * @param statusCode The HTTP status code / exception code (0 if not applicable, e.g. a JSON parse failure)
   * @param responseBody The raw response body if the API responded, otherwise null
   * @param cause The underlying error that caused this exception, if any
   */
  constructor(
    message: string,
    public readonly statusCode: number = 0,
    public readonly responseBody: string | null = null,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'HabboApiException';
    Object.setPrototypeOf(this, HabboApiException.prototype);
  }

  /**
   * Get the response body that the API replied with.
   */
  getResponseBody(): string | null {
    return this.responseBody;
  }
}
