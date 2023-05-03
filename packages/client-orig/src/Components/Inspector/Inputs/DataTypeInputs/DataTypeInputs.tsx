
import type { DataType } from '@moviemasher/lib-core'

import type { JsxElement } from '../../../../Framework/Framework'
import { EmptyElement } from '../../../../Setup/Constants'

export type DataTypeElements = {
  [key in DataType]: JsxElement
}

export const DataTypeInputs: DataTypeElements = {
  string: EmptyElement,
  number: EmptyElement,
  boolean: EmptyElement,
  containerid: EmptyElement,
  contentid: EmptyElement,
  definitionid: EmptyElement,
  fontid: EmptyElement,
  frame: EmptyElement,
  icon: EmptyElement,
  option: EmptyElement,
  percent: EmptyElement,
  rgb: EmptyElement
}
