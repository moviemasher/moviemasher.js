import type { Rgb } from '../Helpers/Color/ColorTypes.js';
import { isObject } from "@moviemasher/runtime-shared";


export const isRgb = (value: any): value is Rgb => {
  return isObject(value) && 'r' in value && 'g' in value && 'b' in value;
};
