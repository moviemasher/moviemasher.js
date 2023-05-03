import { DataGroup, SelectedItems, SelectorType } from "@moviemasher/lib-core"
import { JsxElement } from "../../../../Framework/Framework"
import { WithClassName } from "../../../../Types/Core"
import { PropsWithoutChild } from "../../../../Types/Props"
import { EmptyElement } from '../../../../Setup/Constants'
export type DataGroupElements = {
  [key in DataGroup]: JsxElement
}

export interface DataGroupProps extends PropsWithoutChild, WithClassName {
  selectType?: SelectorType
  selectedItems?: SelectedItems
}

export const DataGroupInputs: DataGroupElements = {
  color: EmptyElement,
  effects: EmptyElement,
  opacity: EmptyElement,
  point: EmptyElement,
  size: EmptyElement,
  timing: EmptyElement
}