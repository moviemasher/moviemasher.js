import { DataType } from '@moviemasher/moviemasher.js'

import { UnknownElement } from '../../../../declarations'
import { EmptyElement } from '../../../../Setup/Constants'

export type DataTypeElements = {
  [key in DataType]: UnknownElement
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
