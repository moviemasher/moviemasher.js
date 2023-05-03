import type { TemplateResult } from 'lit'

import type { ClientReadParams, Icon, Translation } from '@moviemasher/client-core'
import type { Identified, Media, MediaObject, MediaObjects, MediaType, Scalar, TranslateArgs } from '@moviemasher/lib-core'


export type CoreLib = typeof import('@moviemasher/lib-core')
export type CoreClient = typeof import('@moviemasher/client-core')

export type Constructor<T> = new (...args: any[]) => T

export type Html = TemplateResult<1> 
export type Htmls = Html[]

export type Content = Scalar | Html | Node
export type Contents = Content[]
export type OptionalContent = Content | void

export type Nodes = Node[]
export type Elements = Element[]

export interface MovieMasher {
  mediaType: MediaType
  mediaObjects: MediaObjects
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

export type ConnectionEvent = CustomEvent<boolean>
export type MediaTypeEvent = CustomEvent<MediaType>

export interface MediaObjectsEventDetail extends MediaObjectsParams {
  promise?: Promise<MediaObjects>
}

export type MediaObjectsEvent = CustomEvent<MediaObjectsEventDetail>

export interface MediaObjectEventDetail extends Identified {
  mediaObject?: MediaObject
}

export type MediaObjectEvent = CustomEvent<MediaObjectEventDetail>

export interface ImportEventDetail {
  fileList: FileList
}

export type ImportEvent = CustomEvent<ImportEventDetail>

export interface MediaObjectsParams extends ClientReadParams {
  excludeImported?: boolean
  excludeMash?: boolean
  excludeSource?: boolean
}

export interface MediaEventDetail {
  mediaObject: MediaObject
  promise?: Promise<Media>
}
export type MediaEvent = CustomEvent<MediaEventDetail>


export interface IconEventDetail extends TranslateArgs {
  promise?: Promise<Icon>
}

export type IconEvent = CustomEvent<IconEventDetail>

export interface TranslationEventDetail extends TranslateArgs {
  promise?: Promise<Translation>
}

export type TranslationEvent = CustomEvent<TranslationEventDetail>
