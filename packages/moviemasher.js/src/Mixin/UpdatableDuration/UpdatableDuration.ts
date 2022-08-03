import { AudibleSource, Constrained, StartOptions, Value } from "../../declarations"
import { TimeRange } from "../../Helpers/Time/Time"
import { Loader } from "../../Loader/Loader"
import { DefinitionType, isDefinitionType } from "../../Setup/Enums"
import { throwError } from "../../Utility/Throw"
import {
  isPreloadable, isPreloadableDefinition,
  Preloadable, PreloadableDefinition,
  PreloadableDefinitionObject, PreloadableObject
} from "../Preloadable/Preloadable"

export const UpdatableDurationDefinitionTypes = [
  DefinitionType.Audio,
  DefinitionType.Video,
  DefinitionType.VideoSequence,
]
export interface UpdatableDurationObject extends PreloadableObject {
  gain?: Value
  muted?: boolean
  loops?: number
  speed?: number
}

export interface UpdatableDurationDefinitionObject extends PreloadableDefinitionObject {
  duration?: number
  audio?: boolean
  loop?: boolean
  waveform?: string
  audioUrl?: string
}

export interface UpdatableDuration extends Preloadable {
  gain: number
  gainPairs: number[][]

  speed: number
  audibleSource(preloader: Loader): AudibleSource | undefined
  startOptions(seconds: number, timeRange: TimeRange): StartOptions
}
export const isUpdatableDuration = (value?: any): value is UpdatableDuration => {
  return isPreloadable(value) && "startOptions" in value
}
export function assertUpdatableDuration(value?: any, name?: string): asserts value is UpdatableDuration {
  if (!isUpdatableDuration(value)) throwError(value, "Updatable", name)
}

export const isUpdatableDurationType = (value: any): value is DefinitionType => {
  return isDefinitionType(value) && UpdatableDurationDefinitionTypes.includes(value)
}



export interface UpdatableDurationDefinition extends PreloadableDefinition {
  duration: number
  audibleSource(preloader: Loader): AudibleSource | undefined
  audio: boolean
  audioUrl: string
  urlAudible(editing?: boolean): string
  loop: boolean

  frames(quantize: number): number
}
export const isUpdatableDurationDefinition = (value?: any): value is UpdatableDurationDefinition => {
  return isPreloadableDefinition(value) && "audibleSource" in value
}
export function assertUpdatableDurationDefinition(value?: any, name?: string): asserts value is UpdatableDurationDefinition {
  if (!isUpdatableDurationDefinition(value)) throwError(value, "UpdatableDefinition", name)
}

export type UpdatableDurationClass = Constrained<UpdatableDuration>
export type UpdatableDurationDefinitionClass = Constrained<UpdatableDurationDefinition>
