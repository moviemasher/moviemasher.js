import { errorThrow } from '../../../Helpers/Error/ErrorFunctions.js';
import { isObject } from '../../SharedGuards.js';
import { Clip } from './Clip.js';
import { ClipObject } from "./ClipObject.js";




export const isClip = (value: any): value is Clip => {
  return isObject(value) && 'contentId' in value;
};

export function assertClip(value: any, name?: string): asserts value is Clip {
  if (!isClip(value))
    errorThrow(value, 'Clip', name);
}

export const isClipObject = (value: any): value is ClipObject => {
  return isObject(value);
};

