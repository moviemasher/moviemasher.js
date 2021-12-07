import { Constrained, VisibleSource, Size } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time } from "../../Utilities/Time"
import { VisibleContext } from "../../Playing/VisibleContext"
import { Clip, ClipDefinition, ClipDefinitionObject, ClipObject } from "../Clip/Clip"

interface VisibleDefinitionObject extends ClipDefinitionObject {}

interface VisibleDefinition extends ClipDefinition {
  loadedVisible(quantize: number, definitionTime: Time): VisibleSource | undefined
  trackType : TrackType
}

interface VisibleObject extends ClipObject {}

interface Visible extends Clip {
  contextAtTimeToSize(time : Time, quantize: number, dimensions : Size) : VisibleContext | undefined
  loadedVisible(quantize: number, definitionTime : Time) : VisibleSource | undefined
  mergeContextAtTime(time : Time, quantize: number, context : VisibleContext) : void
}

type VisibleClass = Constrained<Visible>
type VisibleDefinitionClass = Constrained<VisibleDefinition>

export {
  Visible,
  VisibleClass,
  VisibleDefinition,
  VisibleDefinitionClass,
  VisibleDefinitionObject,
  VisibleObject,
}
