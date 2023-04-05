import type { TranslateArgs } from '@moviemasher/lib-core'
import type { LitElement, TemplateResult } from 'lit-element'


export type LitClass = Constructor<LitElement>


export type Html = TemplateResult<1> 
export type Htmls = Html[]

export type HtmlOrNode = Html | Node
export type HtmlOrNodes = HtmlOrNode[]

export type HtmlRecord = Record<string, Html>

export type NodeRecord = Record<string, Node>

export type ContentRecord = Record<string, Html | Htmls>
export type Nodes = Node[]
export type NodesRecord = Record<string, Nodes>
export type Elements = Element[]
export type ElementsRecord = Record<string, Elements>
export type ElementRecord = Record<string, Element>

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T> = new (...args: any[]) => T

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

export interface IconEventDetail {
  icon: string
  imageElement?: HTMLImageElement
  imgUrl?: string
  string?: string
  svgElement?: SVGSVGElement
  svgString?: string
  promise?: Promise<IconEventDetail>
}
export type IconEvent = CustomEvent<IconEventDetail>

export interface StringEventDetail extends TranslateArgs {
  string?: Text | string
  promise?: Promise<StringEventDetail>
}
export type StringEvent = CustomEvent<StringEventDetail>

export interface ConnectionEventDetail {
  slotted: string
  connected: boolean
  slots: string[]
}
export type ConnectionEvent = CustomEvent<ConnectionEventDetail>

