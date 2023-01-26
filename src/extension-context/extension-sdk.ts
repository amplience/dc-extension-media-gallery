import { init, ContentFieldExtension } from 'dc-extensions-sdk';
import Field from './field';

let sdk: Promise<ContentFieldExtension<Field>>;

/**
 * Get the Extension SDK instance. This is global and will be initialized on first call.
 * @returns The Extension SDK instance.
 */
export async function getSdk(): Promise<ContentFieldExtension> {
  if (sdk == null) {
    sdk = init();
  }
  return await sdk;
}