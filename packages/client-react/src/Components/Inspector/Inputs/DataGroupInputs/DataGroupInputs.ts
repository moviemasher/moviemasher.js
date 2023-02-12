import { DataGroup, SelectedItems, SelectType } from "@moviemasher/moviemasher.js";
import { PropsWithoutChild, UnknownElement, WithClassName } from "../../../../declarations"
import { EmptyElement } from '../../../../Setup/Constants'
export type DataGroupElements = {
  [key in DataGroup]: UnknownElement
}

export interface DataGroupProps extends PropsWithoutChild, WithClassName {
  selectType?: SelectType
  selectedItems?: SelectedItems
}

export const DataGroupInputs: DataGroupElements = {
  [DataGroup.Size]: EmptyElement,
  [DataGroup.Point]: EmptyElement,
  [DataGroup.Opacity]: EmptyElement,
  [DataGroup.Color]: EmptyElement,
  [DataGroup.Effects]: EmptyElement,
  // [DataGroup.Controls]: EmptyElement,
  [DataGroup.Timing]: EmptyElement,
  // [DataGroup.Clicking]: EmptyElement,
}