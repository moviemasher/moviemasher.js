import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js';
import { isObject } from '../../Shared/SharedGuards.js';
import { FilterDefinition } from './Filter.js';



export const isFilterDefinition = (value: any): value is FilterDefinition => {
  return isObject(value) && 'instanceFromObject' in value;
};
export function assertFilterDefinition(value: any, name?: string): asserts value is FilterDefinition {
  if (!isFilterDefinition(value))
    errorThrow(value, 'FilterDefinition', name);
}
