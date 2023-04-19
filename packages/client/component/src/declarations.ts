import type { Icon, Translation } from '@moviemasher/client-core'
import type { TranslateArgs } from '@moviemasher/lib-core'
import type { TemplateResult } from 'lit'


export type Constructor<T> = new (...args: any[]) => T

export type Html = TemplateResult<1> 
export type Htmls = Html[]

export type Nodes = Node[]
export type Elements = Element[]


export type Value = number | string
export type Scalar = Value | boolean

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

export type Content = Scalar | Html | Node
export type Contents = Content[]

export type SlottedContent = Content | void



export interface IconEventDetail extends TranslateArgs {
  promise?: Promise<Icon>
}

export type IconEvent = CustomEvent<IconEventDetail>

export interface TranslationEventDetail extends TranslateArgs {
  promise?: Promise<Translation>
}

export type TranlationEvent = CustomEvent<TranslationEventDetail>

export interface ConnectionEventDetail {
  slotted: string
  connected: boolean
  slots: string[]
}
export type ConnectionEvent = CustomEvent<ConnectionEventDetail>

