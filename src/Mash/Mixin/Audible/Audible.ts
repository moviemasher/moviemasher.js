import {
  AudibleSource, Constrained, ScalarValue, StartOptions
} from "../../../declarations"
import { ClipDefinition, ClipDefinitionObject, Clip, ClipObject } from "../Clip/Clip"

interface AudibleObject extends ClipObject {
  gain?: ScalarValue
}

interface Audible extends Clip {
  definition : AudibleDefinition
  gain: number
  gainPairs: number[][]
  loadedAudible(): AudibleSource | undefined
  muted: boolean
  startOptions(seconds: number, quantize: number): StartOptions
}

interface AudibleDefinitionObject extends ClipDefinitionObject {
  audio? : string
  source? : string
  stream?: boolean
  url?: string
  waveform? : string
}

interface AudibleDefinition extends ClipDefinition {
  audible: boolean
  loadedAudible(): AudibleSource | undefined
  loops: boolean
  stream: boolean
  waveform?: string
}

type AudibleClass = Constrained<Audible>
type AudibleDefinitionClass = Constrained<AudibleDefinition>

export {
  Audible,
  AudibleClass,
  AudibleDefinition,
  AudibleDefinitionClass,
  AudibleDefinitionObject,
  AudibleObject,
}
