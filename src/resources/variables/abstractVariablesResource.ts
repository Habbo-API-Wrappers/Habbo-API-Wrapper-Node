import { AbstractResource } from '../abstractResource';
import { Transporter } from '../../http/transporter';

/**
 * The base for a variable endpoint resource.
 */
export abstract class AbstractVariablesResource extends AbstractResource {
  protected constructor(
    protected readonly roomId: number,
    transporter: Transporter
  ) {
    super(transporter);
  }
}
