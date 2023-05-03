import { DataOrError } from "@moviemasher/lib-core"

export interface Icon {
  imageElement?: HTMLImageElement
  imgUrl?: string
  string?: string
  svgElement?: SVGSVGElement
  svgString?: string
}

export type IconDataOrError = DataOrError<Icon>

export interface Translation {
  text?: Text
  string?: string
}

export type TranslationDataOrError = DataOrError<Translation>
