import { Constrained, VisibleSource, Size } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time"
import { VisibleContext } from "../../Context/VisibleContext"
import { Clip, ClipDefinition, ClipDefinitionObject, ClipObject } from "../Clip/Clip"
import { Preloader } from "../../Preloader/Preloader"

interface VisibleDefinitionObject extends ClipDefinitionObject {}

interface VisibleDefinition extends ClipDefinition {
  loadedVisible(preloader: Preloader, quantize: number, definitionTime: Time): VisibleSource | undefined
  size(preloader: Preloader): Size | undefined
  trackType: TrackType
}

interface VisibleObject extends ClipObject {}

interface Visible extends Clip {
  contextAtTimeToSize(preloader: Preloader, time: Time, quantize: number, dimensions: Size, ): VisibleContext | undefined
  definition: VisibleDefinition
  loadedVisible(preloader: Preloader, quantize: number, definitionTime: Time): VisibleSource | undefined
  mergeContextAtTime(preloader: Preloader, time: Time, quantize: number, context: VisibleContext): void
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
