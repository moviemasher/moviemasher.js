import { Constrained } from "../../declarations"
import {
  Audible, AudibleObject, AudibleDefinition, AudibleDefinitionObject
} from "../Audible/Audible"

interface StreamableObject extends AudibleObject {
  something?: string
}

interface Streamable extends Audible {
  definition: StreamableDefinition
  something?: string
}

interface StreamableDefinitionObject extends AudibleDefinitionObject {
  format?: string
}

interface StreamableDefinition extends AudibleDefinition {
  format: string

}

type StreamableClass = Constrained<Streamable>
type StreamableDefinitionClass = Constrained<StreamableDefinition>

export {
  Streamable,
  StreamableClass,
  StreamableDefinition,
  StreamableDefinitionClass,
  StreamableDefinitionObject,
  StreamableObject,
}
