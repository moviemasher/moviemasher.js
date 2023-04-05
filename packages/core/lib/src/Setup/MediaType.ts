import type {
  AudioType, EffectType, FontType, ImageType, MashType, VideoType, 
} from '../Setup/Enums.js'

import { 
   TypeAudio, TypeEffect, TypeFont, TypeImage, TypeMash, TypeVideo 
} from './Enums.js'
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'


export type MediaType = AudioType | EffectType | FontType | ImageType | MashType | VideoType 
export type MediaTypes = MediaType[]
export const MediaTypes: MediaTypes = [TypeAudio, TypeEffect, TypeFont, TypeImage, TypeMash, TypeVideo]
export type MediaTypesRecord = Record<string, MediaTypes>
export const isMediaType = (value: any): value is MediaType => {
  return MediaTypes.includes(value)
}
export function assertMediaType(value?: any, name?: string): asserts value is MediaType {
  if (!isMediaType(value)) errorThrow(value, 'MediaType', name)
}
