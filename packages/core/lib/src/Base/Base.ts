import type { ValueRecord } from '@moviemasher/runtime-shared'
import type { Identified } from '@moviemasher/runtime-shared'


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
