import { Propertied } from "../../../Base/Propertied"
import { Selectable } from "../../../Editor/Selectable"

export interface ControlObject {
  label?: string
  icon?: string
  frame?: number
  frames?: number
}

export interface Control extends Required<ControlObject>, Selectable, Propertied {
  id: string
  // clicking: string
}
export type Controls = Control[]
