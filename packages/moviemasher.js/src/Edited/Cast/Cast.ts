import { Described, UnknownObject } from "../../declarations"
import { Edited } from "../Edited"
import { Layer } from "./Layer/Layer"

interface CastDescription extends UnknownObject, Described {}
interface CastObject extends Partial<CastDescription> {}

interface Cast extends Edited {
  layers: Layer[]
  toJSON(): UnknownObject
}

export { Cast, CastObject, CastDescription}
