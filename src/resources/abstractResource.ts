import { Transporter } from '../http/transporter';

/**
 * The base for an endpoint resource.
 */
export abstract class AbstractResource {
  protected constructor(protected readonly transporter: Transporter) {}
}
