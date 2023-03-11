import type { Labeled } from '@moviemasher/moviemasher.js'
import { MouseEventFunction } from '../Framework/Framework'
import { JsxAndChildren, JsxChild, JsxChildren } from "./Element"
import { WithClassName } from './Core'


export type PropsMethod<I, O> = (input?: I) => O

export interface PropsWithChildren extends PropsContainer, WithClassName {}

export interface PropsWithoutChild extends PropsContained, WithClassName {}

export interface PropsAndChild extends WithClassName { 
  children: JsxChild
}

export interface PropsAndChildren extends WithClassName { 
  children: JsxAndChildren
}

export interface PropsContainer {
  children?: JsxChildren
}
export interface PropsContained {
  children?: never
}

export interface WithOnClick {
  onClick: MouseEventFunction
}

export interface PropsClickable extends PropsWithChildren, Labeled {
  button?: boolean
}
