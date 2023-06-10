import type { EndpointRequest } from '@moviemasher/runtime-shared';
import { isObject } from '../Shared/SharedGuards.js';
import { isTyped } from "./TypedGuards.js";



export interface Output {
  request?: EndpointRequest;
  type: string;
}


export const isOutput = (value: any): value is Output => {
  return isObject(value) && isTyped(value);
};
