import { Constrained, Value } from "../../declarations"
import {
  Audible, AudibleObject, AudibleDefinition, AudibleDefinitionObject
} from "../Audible/Audible"

export interface AudibleFileObject extends AudibleObject {
  trim?: number
  loop?: number
}

export interface AudibleFile extends Audible {
  definition : AudibleFileDefinition
  trim: number
  loop: number
}

export interface AudibleFileDefinitionObject extends AudibleDefinitionObject {
  duration?: Value
  loops?: boolean
}

export interface AudibleFileDefinition extends AudibleDefinition {
  duration : number
  loops : boolean
}

export type AudibleFileClass = Constrained<AudibleFile>
export type AudibleFileDefinitionClass = Constrained<AudibleFileDefinition>
