import { Described, FilterGraphOptions, GraphFiles, UnknownObject } from "../../declarations"
import { Edited } from "../Edited"
import { Mash } from "../Mash/Mash"
import { Layer } from "./Layer/Layer"

interface CastDescription extends UnknownObject, Described {}
interface CastObject extends Partial<CastDescription> {}

interface Cast extends Edited {
  layers: Layer[]
  mashes: Mash[]
  toJSON(): UnknownObject
  graphFiles(args: FilterGraphOptions): GraphFiles
}

export { Cast, CastObject, CastDescription}
