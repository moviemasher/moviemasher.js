import { DataType } from "@moviemasher/moviemasher.js"
import { UnknownElement } from "../../../declarations"

export type EditorInputs = {
  [key in DataType]: UnknownElement
}
