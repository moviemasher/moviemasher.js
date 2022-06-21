import { AudibleSource, Constrained, StartOptions, Value } from "../../declarations"
import { TimeRange } from "../../Helpers/Time/Time"
import { Loader } from "../../Loader/Loader"
import { throwError } from "../../Utility/Is"
import {
  isPreloadable, isPreloadableDefinition,
  Preloadable, PreloadableDefinition,
  PreloadableDefinitionObject, PreloadableObject
} from "../Preloadable/Preloadable"

export interface UpdatableDurationObject extends PreloadableObject {
  gain?: Value
  muted?: boolean
  loops?: number

  speed?: number
}

export interface UpdatableDurationDefinitionObject extends PreloadableDefinitionObject {
  duration?: number
  loop?: boolean
  waveform?: string
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

export interface UpdatableDurationDefinition extends PreloadableDefinition {
  duration: number
  audibleSource(preloader: Loader): AudibleSource | undefined

  urlAudible: string
  loop: boolean

  frames(quantize: number): number
}
export const isUpdatableDurationDefinition = (value?: any): value is UpdatableDurationDefinition => {
  return isPreloadableDefinition(value) && "duration" in value
}
export function assertUpdatableDurationDefinition(value?: any, name?: string): asserts value is UpdatableDurationDefinition {
  if (!isUpdatableDurationDefinition(value)) throwError(value, "UpdatableDefinition", name)
}

export type UpdatableDurationClass = Constrained<UpdatableDuration>
export type UpdatableDurationDefinitionClass = Constrained<UpdatableDurationDefinition>
