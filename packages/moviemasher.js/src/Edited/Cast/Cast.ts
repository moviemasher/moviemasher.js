import { Described, GraphFiles, UnknownObject } from "../../declarations"
import { Edited } from "../Edited"
import { FilterGraphOptions } from "../Mash/FilterGraph/FilterGraph"
import { Mash } from "../Mash/Mash"
import { Layers } from "./Layer/Layer"

export interface CastDescription extends UnknownObject, Described {}
export interface CastObject extends Partial<CastDescription> {}

export interface Cast extends Edited {
  layers: Layers
  mashes: Mash[]
  toJSON(): UnknownObject
  graphFiles(args: FilterGraphOptions): GraphFiles
}
