import { DataType } from '@moviemasher/moviemasher.js'

import { UnknownElement } from '../../../../declarations'
import { EmptyElement } from '../../../../Setup/Constants'

export type DataTypeElements = {
  [key in DataType]: UnknownElement
}

export const DataTypeInputs: DataTypeElements = {
  [DataType.Frame]: EmptyElement,
  [DataType.Number]: EmptyElement,
  [DataType.Rgb]: EmptyElement,
  [DataType.String]: EmptyElement,
  [DataType.DefinitionId]: EmptyElement,
  [DataType.FontId]: EmptyElement,
  [DataType.Percent]: EmptyElement,
  [DataType.ContainerId]: EmptyElement,
  [DataType.ContentId]: EmptyElement,
  [DataType.Boolean]: EmptyElement,
  [DataType.Timing]: EmptyElement,
  [DataType.Sizing]: EmptyElement,
}
