import { ScalarValue } from "../../../Setup/declarations";
import { Time } from "../../../Utilities/Time";
import { ClipDefinition, ClipDefinitionObject } from "../Clip/Clip";
import { Clip, ClipObject } from "../Clip/Clip";

interface AudibleObject extends ClipObject {
  gain?: ScalarValue
  trim?: number
}

interface Audible extends Clip {
  definition : AudibleDefinition
  gain: number
  gainPairs: number[][]
  muted: boolean
  trim: number
}

interface AudibleDefinitionObject extends ClipDefinitionObject {
  duration? : ScalarValue
  url? : string
  audio? : string
  source? : string
  loops? : boolean
  waveform? : string
}

interface AudibleDefinition extends ClipDefinition {
  audible : boolean
  duration : number
  loops : boolean
  loadedAudible(_time?: Time) : AudioBuffer | undefined
  waveform? : string
}

export { Audible, AudibleDefinition, AudibleDefinitionObject, AudibleObject }
