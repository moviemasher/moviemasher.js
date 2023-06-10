import { errorThrow } from '../Helpers/Error/ErrorFunctions.js';
import { isObject, isPopulatedString } from '../Shared/SharedGuards.js';
import { Typed } from '@moviemasher/runtime-shared';

export const isTyped = (value: any): value is Typed => {
  return isObject(value) &&
    'type' in value &&
    isPopulatedString(value.type);
};
export function assertTyped(value: any, name?: string): asserts value is Typed {
  if (!isTyped(value))
    errorThrow(value, 'Typed', name);
}
