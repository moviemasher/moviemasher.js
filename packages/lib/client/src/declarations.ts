import type { 
  AssetObject, AssetObjects, AssetType, DataOrError, Identified, Importers, 
  Scalar, StringRecord, Strings
} from '@moviemasher/runtime-shared'
import type { TranslateArgs } from '@moviemasher/runtime-client'
import type { TemplateResult } from 'lit'


export type CoreLib = typeof import('@moviemasher/lib-shared')

export type Constructor<T> = new (...args: any[]) => T

export type Html = TemplateResult<1> 
export type Htmls = Html[]

export type Content = Html | Node | Scalar 
export type Contents = Content[]
export type OptionalContent = Content | void

export type Nodes = Node[]
export type Elements = Element[]

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


export type AssetTypeEvent = CustomEvent<AssetType>

export interface AssetObjectsEventDetail extends AssetObjectsParams {
  promise?: Promise<DataOrError<AssetObjects>>
}

export type AssetObjectsEvent = CustomEvent<AssetObjectsEventDetail>

export interface AssetObjectFromIdEventDetail extends Identified {
  assetObject?: AssetObject
}

export type AssetObjectFromIdEvent = CustomEvent<AssetObjectFromIdEventDetail>


export interface AssetObjectPromiseEventDetail {
  promise?: Promise<DataOrError<AssetObject>>
}
export type AssetObjectPromiseEvent = CustomEvent<AssetObjectPromiseEventDetail>


export interface ImportEventDetail {
  fileList: FileList
  promise?: Promise<AssetObjects>
}

export type ImportEvent = CustomEvent<ImportEventDetail>

export interface ImportAssetObjectsEventDetail {
  assetObjects: AssetObjects
}
export type ImportAssetObjectsEvent = CustomEvent<ImportAssetObjectsEventDetail>

export interface AssetObjectsParams extends ClientReadParams {
  excludeImported?: boolean
  excludeMash?: boolean
  excludeSource?: boolean
}


export interface IconEventDetail extends TranslateArgs {
  promise?: Promise<DataOrError<Icon>>
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

export interface ImportersEventDetail {
  importers: Importers
}