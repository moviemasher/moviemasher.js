import type { DataOrError } from '@moviemasher/runtime-shared'
import type { TranslateArgs } from './Translate.js'


export interface Icon {
  imageElement?: HTMLImageElement
  imgUrl?: string
  string?: string
  svgElement?: SVGSVGElement
  svgString?: string
}


export type IconDataOrError = DataOrError<Icon>

export interface IconEventDetail extends TranslateArgs {
  promise?: Promise<IconDataOrError>
}

export type IconEvent = CustomEvent<IconEventDetail>
