import { Constrained } from "../../declarations"
import {
  Audible, AudibleObject, AudibleDefinition, AudibleDefinitionObject
} from "../Audible/Audible"

export interface StreamableObject extends AudibleObject {
  something?: string
}

export interface Streamable extends Audible {
  definition: StreamableDefinition
  something?: string
}

export interface StreamableDefinitionObject extends AudibleDefinitionObject {
  format?: string
}

export interface StreamableDefinition extends AudibleDefinition {
  format: string

}

export type StreamableClass = Constrained<Streamable>
export type StreamableDefinitionClass = Constrained<StreamableDefinition>
