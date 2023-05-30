import type { ImportedAssetObject } from './ImportedTypes.js';
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js';
import { isRequest } from '../../Helpers/Request/RequestFunctions.js';
import { isAssetObject } from '../Asset/AssetGuards.js';


export const isImportedAssetObject = (value: any): value is ImportedAssetObject => (
  isAssetObject(value) && 'request' in value && isRequest(value.request)
);

export function assertImportedAssetObject(value: any, name?: string): asserts value is ImportedAssetObject {
  if (!isImportedAssetObject(value))
    errorThrow(value, 'ImportedAssetObject', name);
}
