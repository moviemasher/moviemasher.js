import type { ClientAudioNode, ClientAudio } from '../../Helpers/ClientMedia/ClientMedia.js'
import type { Constrained } from '../../Base/Constrained.js'
import type { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from '../../Media/Content/Content.js'
import type { MediaType } from '../../Setup/MediaType.js'
import type { Numbers, Value } from '../../Types/Core.js'
import type { StartOptions } from '../../Plugin/Masher/Preview/AudioPreview/AudioPreview.js'
import type { TimeRange } from '../../Helpers/Time/Time.js'

import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isContent, isContentDefinition } from '../../Media/Content/ContentFunctions.js'
import { isMediaType } from '../../Setup/MediaType.js'
import { TypeAudio, TypeVideo } from '../../Setup/Enums.js'

export const UpdatableDurationMediaTypes: MediaType[] = [TypeAudio, TypeVideo]

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
  gainPairs: Numbers[]
  speed: number
  startOptions(seconds: number, timeRange: TimeRange): StartOptions
}
export const isUpdatableDuration = (value?: any): value is UpdatableDuration => {
  return isContent(value) && 'startOptions' in value
}
export function assertUpdatableDuration(value?: any, name?: string): asserts value is UpdatableDuration {
  if (!isUpdatableDuration(value)) errorThrow(value, 'Updatable', name)
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
  preloadAudioPromise: Promise<void> 
  loop: boolean
}
export const isUpdatableDurationDefinition = (value?: any): value is UpdatableDurationDefinition => {
  return isContentDefinition(value) && 'audibleSource' in value
}
export function assertUpdatableDurationDefinition(value?: any, name?: string): asserts value is UpdatableDurationDefinition {
  if (!isUpdatableDurationDefinition(value)) errorThrow(value, 'UpdatableDefinition', name)
}

export type UpdatableDurationClass = Constrained<UpdatableDuration>
export type UpdatableDurationDefinitionClass = Constrained<UpdatableDurationDefinition>
