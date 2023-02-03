import {
  UnknownObject, Value, Described
} from "../../declarations"
import { AVType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time/Time"
import { Clip, Clips } from "./Track/Clip/Clip"
import { AudioPreview } from "./Preview/AudioPreview/AudioPreview"
import { TimeRange } from "../../Helpers/Time/Time"
import { Edited, EditedArgs, EditedObject } from "../../Edited/Edited"
import { Track, TrackObject } from "./Track/Track"
import { FilterGraphsOptions } from "./FilterGraphs/FilterGraphs"
import { FilterGraphs } from "./FilterGraphs/FilterGraphs"
import { DefinitionObjects } from "../../Definition/Definition"
import { isObject } from "../../Utility/Is"

import { LayerMash } from "../Cast/Layer/Layer"
import { errorsThrow } from "../../Utility/Errors"
import { Propertied } from "../../Base/Propertied"
import { Effect } from "../../Module/Effect/Effect"
import { Control, ControlObject, Controls } from "./Control/Control"

// export interface DefinitionReferenceObject {
//   definitionId: string
//   definitionType: DefinitionType
//   label: string
// }

export enum Frame {
  First = 0,
  Last = -1,
}

export type Movable = Effect | Control 
export type Movables = Movable[]

export interface MashDescription extends UnknownObject, Described {}

export interface MashObject extends EditedObject {
  // definitionReferences?: DefinitionReferenceObjects
  gain?: Value
  tracks?: TrackObject[]
  controls?: ControlObject[]
  frame?: number
  rendering?: string
}

// export type DefinitionReferenceObjects = DefinitionReferenceObject[]

export interface MashAndDefinitionsObject {
  mashObject: MashObject
  definitionObjects: DefinitionObjects
}
export const isMashAndDefinitionsObject = (value: any): value is MashAndDefinitionsObject => {
  return isObject(value) && "mashObject" in value && "definitionObjects" in value
}

export interface MashArgs extends EditedArgs, MashObject { }

export interface Mash extends Edited {
  /** this.time -> this.endTime in time's fps */
  addClipToTrack(clip : Clip | Clips, trackIndex? : number, insertIndex? : number, frame? : number) : void
  addTrack(object?: TrackObject): Track
  changeTiming(propertied: Propertied, property: string, value : number) : void
  clearPreview(): void
  clips: Clip[]
  clipsInTimeOfType(time: Time, avType?: AVType): Clip[]
  composition: AudioPreview
  controls: Controls
  definitionIds: string[]
  draw() : void
  drawnTime? : Time
  duration: number
  endTime: Time
  filterGraphs(args?: FilterGraphsOptions): FilterGraphs
  frame: number
  frames: number
  gain: number
  layer: LayerMash
  loop: boolean
  paused: boolean
  quantize : number
  removeClipFromTrack(clip : Clip | Clips) : void
  removeTrack(index?: number): void
  rendering: string
  seekToTime(time: Time): Promise<void> | undefined
  time: Time
  timeRange: TimeRange
  toJSON(): UnknownObject
  tracks: Track[]
}

export type Mashes = Mash[]

export const isMash = (value: any): value is Mash => {
  return isObject(value) && "composition" in value
}

export function assertMash(value: any, name?: string): asserts value is Mash {
  if (!isMash(value)) errorsThrow(value, "Mash", name)
}
