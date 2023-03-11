import { DataType } from '@moviemasher/moviemasher.js'

import { JsxElement } from '../../../../Framework/Framework'
import { EmptyElement } from '../../../../Setup/Constants'

export type DataTypeElements = {
  [key in DataType]: JsxElement
}

export const DataTypeInputs: DataTypeElements = {
  [DataType.Boolean]: EmptyElement,
  [DataType.ContainerId]: EmptyElement,
  [DataType.ContentId]: EmptyElement,
  [DataType.DefinitionId]: EmptyElement,
  [DataType.FontId]: EmptyElement,
  [DataType.Frame]: EmptyElement,
  [DataType.Icon]: EmptyElement,
  [DataType.Number]: EmptyElement,
  [DataType.Percent]: EmptyElement,
  [DataType.Rgb]: EmptyElement,
  [DataType.String]: EmptyElement,
  [DataType.Option]: EmptyElement,
}
