import { TranslateArgs } from "../Plugin/Translate/Translate"

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
