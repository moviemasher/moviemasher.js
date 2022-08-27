import { DataGroup, SelectType } from "@moviemasher/moviemasher.js";
import { PropsWithoutChild, UnknownElement, WithClassName } from "../../../../declarations"
import { EmptyElement } from '../../../../Setup/Constants'
export type DataGroupElements = {
  [key in DataGroup]: UnknownElement
}

export interface DataGroupProps extends PropsWithoutChild, WithClassName {
  selectType?: SelectType
}

export const DataGroupInputs: DataGroupElements = {
  [DataGroup.Size]: EmptyElement,
  [DataGroup.Sizing]: EmptyElement,
  [DataGroup.Point]: EmptyElement,
  [DataGroup.Opacity]: EmptyElement,
  [DataGroup.Color]: EmptyElement,
  [DataGroup.Effects]: EmptyElement,
  [DataGroup.Timing]: EmptyElement,
}