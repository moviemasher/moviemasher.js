import { AVType } from "../../../Setup/Enums"
import { Mash } from "../../Mash/Mash"

export interface Layer {
  mash?: Mash
  disabled?: AVType
}

export type Layers = Layer[]
