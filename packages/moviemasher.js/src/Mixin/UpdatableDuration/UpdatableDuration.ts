import { AudibleSource, Constrained, LoadedAudio, StartOptions, Value } from "../../declarations"
import { TimeRange } from "../../Helpers/Time/Time"
import { DefinitionType, isDefinitionType } from "../../Setup/Enums"
import { errorsThrow } from "../../Utility/Errors"
import {
  isPreloadable, isPreloadableDefinition,
  Preloadable, PreloadableDefinition,
  PreloadableDefinitionObject, PreloadableObject
} from "../Preloadable/Preloadable"

export const UpdatableDurationDefinitionTypes = [
  DefinitionType.Audio,
  DefinitionType.Video,
  // DefinitionType.Sequence,
]
export interface UpdatableDurationObject extends PreloadableObject {
  gain?: Value
  muted?: boolean
  loops?: number
  speed?: number
  startTrim?: number
  endTrim?: number
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
  startOptions(seconds: number, timeRange: TimeRange): StartOptions
}
export const isUpdatableDuration = (value?: any): value is UpdatableDuration => {
  return isPreloadable(value) && "startOptions" in value
}
export function assertUpdatableDuration(value?: any, name?: string): asserts value is UpdatableDuration {
  if (!isUpdatableDuration(value)) errorsThrow(value, "Updatable", name)
}

export const isUpdatableDurationType = (value: any): value is DefinitionType => {
  return isDefinitionType(value) && UpdatableDurationDefinitionTypes.includes(value)
}

export interface UpdatableDurationDefinition extends PreloadableDefinition {
  audibleSource(): AudibleSource | undefined
  audio: boolean
  audioUrl: string
  duration: number
  frames(quantize: number): number
  loadedAudio?: LoadedAudio
  loadedAudioPromise: Promise<LoadedAudio> 
  loop: boolean
}
export const isUpdatableDurationDefinition = (value?: any): value is UpdatableDurationDefinition => {
  return isPreloadableDefinition(value) && "audibleSource" in value
}
export function assertUpdatableDurationDefinition(value?: any, name?: string): asserts value is UpdatableDurationDefinition {
  if (!isUpdatableDurationDefinition(value)) errorsThrow(value, "UpdatableDefinition", name)
}

export type UpdatableDurationClass = Constrained<UpdatableDuration>
export type UpdatableDurationDefinitionClass = Constrained<UpdatableDurationDefinition>
