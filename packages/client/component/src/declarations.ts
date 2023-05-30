import type { TemplateResult } from 'lit'

import { AssetType, DataOrError, Identified, Scalar, StringRecord, Strings } from '@moviemasher/runtime-shared'
import { AssetObject, AssetObjects, TranslateArgs } from '@moviemasher/lib-core'


export type CoreLib = typeof import('@moviemasher/lib-core')

export type Constructor<T> = new (...args: any[]) => T

export type Html = TemplateResult<1> 
export type Htmls = Html[]

export type Content = Html | Node | Scalar 
export type Contents = Content[]
export type OptionalContent = Content | void

export type Nodes = Node[]
export type Elements = Element[]

export interface MovieMasherContext {
  mediaType: AssetType
  mediaObjects: AssetObjects
  accept: string
}


export type InspectorFormSlot = 'inspector'
export type ViewerFormSlot = 'viewer'
export type SelectorFormSlot = 'selector'
export type ComposerFormSlot = 'composer'
export type FormSlot = InspectorFormSlot | ViewerFormSlot | SelectorFormSlot | ComposerFormSlot

export type HeaderSectionSlot = 'header'
export type FooterSectionSlot = 'footer'
export type DivSectionSlot = 'div'
export type SectionSlot = HeaderSectionSlot | FooterSectionSlot | DivSectionSlot

export type LeftSlot = 'left'
export type RightSlot = 'right'
export type CenterSlot = 'center'

export type IconSlot = 'icon'
export type StringSlot = 'string'


export interface ConnectionEventDetail {
  connected: boolean
  handled?: boolean
}

export type ConnectionEvent = CustomEvent<ConnectionEventDetail>


export type MediaTypeEvent = CustomEvent<AssetType>

export interface AssetObjectsEventDetail extends AssetObjectsParams {
  promise?: Promise<AssetObjects>
}

export type MediaObjectsEvent = CustomEvent<AssetObjectsEventDetail>

export interface AssetObjectEventDetail extends Identified {
  mediaObject?: AssetObject
}

export type MediaObjectEvent = CustomEvent<AssetObjectEventDetail>

export interface ImportEventDetail {
  fileList: FileList
}

export type ImportEvent = CustomEvent<ImportEventDetail>

export interface AssetObjectsParams extends ClientReadParams {
  excludeImported?: boolean
  excludeMash?: boolean
  excludeSource?: boolean
}


export interface IconEventDetail extends TranslateArgs {
  promise?: Promise<Icon>
}

export type IconEvent = CustomEvent<IconEventDetail>

export interface TranslationEventDetail extends TranslateArgs {
  promise?: Promise<Translation>
}

export type TranslationEvent = CustomEvent<TranslationEventDetail>


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

export interface ClientReadParams {
  type: AssetType 
  kind?: string | Strings
  order?: string | StringRecord
  terms?: string
}
