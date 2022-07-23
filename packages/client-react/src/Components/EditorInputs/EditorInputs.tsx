import { DataType, DefinitionType } from '@moviemasher/moviemasher.js'
import { UnknownElement } from '../../declarations'

import { EmptyElement } from '../../Setup/Constants'

export type DataTypeElements = {
  [key in DataType]: UnknownElement
}

export type DefinitionTypeElements = {
  [key in DefinitionType]?: UnknownElement
}

export const DefinitionTypeInputs: DefinitionTypeElements = {}

export const DataTypeInputs: DataTypeElements = {
  [DataType.Frame]: EmptyElement,
  [DataType.Number]: EmptyElement,
  [DataType.Rgb]: EmptyElement,
  [DataType.Rgba]: EmptyElement,
  [DataType.String]: EmptyElement,
  [DataType.Track]: EmptyElement,
  [DataType.DefinitionId]: EmptyElement,
  [DataType.FontId]: EmptyElement,
  [DataType.Percent]: EmptyElement,
  [DataType.ContainerId]: EmptyElement,
  [DataType.ContentId]: EmptyElement,
  [DataType.Boolean]: EmptyElement,
  [DataType.Mode]: EmptyElement,
  [DataType.Direction4]: EmptyElement,
  [DataType.Direction8]: EmptyElement,
  [DataType.Orientation]: EmptyElement,
}
