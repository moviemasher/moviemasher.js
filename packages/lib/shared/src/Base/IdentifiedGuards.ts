import type { Identified } from '@moviemasher/runtime-shared'

import { isObject, isPopulatedString } from '../Shared/SharedGuards.js'
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'

export const isIdentified = (value: any): value is Identified => {
  return isObject(value) && 'id' in value && isPopulatedString(value.id);
};
export function assertIdentified(value: any, name?: string): asserts value is Identified {
  if (!isIdentified(value))
    errorThrow(value, 'Identified', name);
}
