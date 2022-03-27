import { Described, GraphFiles, UnknownObject } from "../../declarations"
import { Edited } from "../Edited"
import { FilterGraphOptions } from "../Mash/FilterGraph/FilterGraph"
import { Mash } from "../Mash/Mash"

interface CastDescription extends UnknownObject, Described {}
interface CastObject extends Partial<CastDescription> {}

interface Cast extends Edited {
  mashes: Mash[]
  toJSON(): UnknownObject
  graphFiles(args: FilterGraphOptions): GraphFiles
}

export { Cast, CastObject, CastDescription}
