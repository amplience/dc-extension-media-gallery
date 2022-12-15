import { init, ContentFieldExtension } from 'dc-extensions-sdk';
import Field from './field';

let sdk: Promise<ContentFieldExtension<Field>>;

export async function getSdk(): Promise<ContentFieldExtension> {
  if (sdk == null) {
    sdk = init();
  }
  return await sdk;
}