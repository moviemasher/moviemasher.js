import { DataGroup, SelectedItems, SelectorType } from "@moviemasher/moviemasher.js"
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
  [DataGroup.Size]: EmptyElement,
  [DataGroup.Point]: EmptyElement,
  [DataGroup.Opacity]: EmptyElement,
  [DataGroup.Color]: EmptyElement,
  [DataGroup.Effects]: EmptyElement,
  [DataGroup.Timing]: EmptyElement,
}