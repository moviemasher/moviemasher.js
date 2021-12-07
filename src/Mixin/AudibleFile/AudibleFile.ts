import { Constrained, ScalarValue } from "../../declarations"
import {
  Audible, AudibleObject, AudibleDefinition, AudibleDefinitionObject
} from "../Audible/Audible"

interface AudibleFileObject extends AudibleObject {
  trim?: number
  loop?: number
}

interface AudibleFile extends Audible {
  definition : AudibleFileDefinition
  trim: number
  loop: number
}

interface AudibleFileDefinitionObject extends AudibleDefinitionObject {
  duration?: ScalarValue
  loops?: boolean
}

interface AudibleFileDefinition extends AudibleDefinition {
  duration : number
  loops : boolean
}

type AudibleFileClass = Constrained<AudibleFile>
type AudibleFileDefinitionClass = Constrained<AudibleFileDefinition>

export {
  AudibleFile,
  AudibleFileClass,
  AudibleFileDefinition,
  AudibleFileDefinitionClass,
  AudibleFileDefinitionObject,
  AudibleFileObject,
}
