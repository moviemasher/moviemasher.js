import { VisibleContext } from "../../../Playing/VisibleContext"
import { DrawingSource, Size } from "../../../declarations"
import { TrackType } from "../../../Setup/Enums"
import { Time } from "../../../Utilities/Time"
import { DefinitionObject } from "../../Definition/Definition"
import { Clip, ClipDefinition, ClipObject } from "../Clip/Clip"

interface VisibleObject extends ClipObject {}

interface Visible extends Clip {
  contextAtTimeToSize(time : Time, quantize: number, dimensions : Size) : VisibleContext | undefined
  mergeContextAtTime(time : Time, quantize: number, context : VisibleContext) : void
}

interface VisibleDefinitionObject extends DefinitionObject {}

interface VisibleDefinition extends ClipDefinition {
  trackType : TrackType
  loadedVisible(_time? : Time) : DrawingSource | undefined
}

export { Visible, VisibleDefinition, VisibleDefinitionObject, VisibleObject }
