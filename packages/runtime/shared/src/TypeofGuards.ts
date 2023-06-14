import { PopulatedString, Unknowns } from './Core.js'

export const length = (value: string | Unknowns): boolean => !!value.length;
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean';
export const isString = (value: any): value is string => (
  typeof value === 'string'
);
export const isPopulatedString = (value: any): value is PopulatedString => isString(value) && length(String(value));

export const isUndefined = (value: any): boolean => typeof value === 'undefined';
export const isDefined = (value: any): boolean => !isUndefined(value);

export const isObject = (value: any): value is object => typeof value === 'object';

export const isNumber = (value: any): value is number => isNumberOrNaN(value) && !Number.isNaN(value);
export const isNumberOrNaN = (value: any): value is number => typeof value === 'number';
export const isNan = (value: any): boolean => isNumberOrNaN(value) && Number.isNaN(value);

export const isNumeric = (value: any): boolean => (
  (isNumber(value) || isPopulatedString(value)) && !isNan(Number(value))
);

export function isArray<T = unknown>(value: any): value is T[] {
  return Array.isArray(value);
}
