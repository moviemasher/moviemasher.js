import { Value } from "../../declarations"
import { Constrained } from "../../Base/Constrained"
import { StartOptions } from "../../Editor/Preview/AudioPreview/AudioPreview"
import { ClientAudioNode, ClientAudio } from "../../ClientMedia/ClientMedia"
import { TimeRange } from "../../Helpers/Time/Time"
import { MediaType, isMediaType, AudioType, VideoType } from "../../Setup/Enums"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"

import { Content, ContentDefinition, ContentDefinitionObject, ContentObject, isContent, isContentDefinition } from "../../Media/Content/Content"

export const UpdatableDurationMediaTypes: MediaType[] = [
  AudioType,
  VideoType,
  // SequenceType,
]
export interface UpdatableDurationObject extends ContentObject {
  gain?: Value
  muted?: boolean
  loops?: number
  speed?: number
  startTrim?: number
  endTrim?: number
}

export interface UpdatableDurationDefinitionObject extends ContentDefinitionObject {
  duration?: number
  audio?: boolean
  loop?: boolean
  waveform?: string
  audioUrl?: string
}

export interface UpdatableDuration extends Content {
  gain: number
  gainPairs: number[][]
  speed: number
  startOptions(seconds: number, timeRange: TimeRange): StartOptions
}
export const isUpdatableDuration = (value?: any): value is UpdatableDuration => {
  return isContent(value) && "startOptions" in value
}
export function assertUpdatableDuration(value?: any, name?: string): asserts value is UpdatableDuration {
  if (!isUpdatableDuration(value)) errorThrow(value, "Updatable", name)
}

export const isUpdatableDurationType = (value: any): value is MediaType => {
  return isMediaType(value) && UpdatableDurationMediaTypes.includes(value)
}

export interface UpdatableDurationDefinition extends ContentDefinition {
  audibleSource(): ClientAudioNode | undefined
  audio: boolean
  audioUrl: string
  duration: number
  frames(quantize: number): number
  loadedAudio?: ClientAudio
  loadedAudioPromise: Promise<ClientAudio> 
  loop: boolean
}
export const isUpdatableDurationDefinition = (value?: any): value is UpdatableDurationDefinition => {
  return isContentDefinition(value) && "audibleSource" in value
}
export function assertUpdatableDurationDefinition(value?: any, name?: string): asserts value is UpdatableDurationDefinition {
  if (!isUpdatableDurationDefinition(value)) errorThrow(value, "UpdatableDefinition", name)
}

export type UpdatableDurationClass = Constrained<UpdatableDuration>
export type UpdatableDurationDefinitionClass = Constrained<UpdatableDurationDefinition>
