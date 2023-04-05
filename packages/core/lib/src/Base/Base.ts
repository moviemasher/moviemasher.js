import type { ValueRecord } from '../Types/Core.js'
import type { Identified } from './Identified.js'


export interface TranslateArgs extends Identified {
  locale?: string
  values?: ValueRecord
}


export interface Framed {
  frame: number
}

export interface Indexed {
  index: number
}

export interface Tracked {
  trackNumber: number
}

export interface Labeled {
  label?: string | TranslateArgs
}
