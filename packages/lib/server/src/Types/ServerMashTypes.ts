import type { GraphFiles, ServerAsset, ServerPromiseArgs } from '@moviemasher/runtime-server'
import type { AVType, AudioInstance, AudioInstanceObject, Clip, ImageInstance, Instance, InstanceArgs, InstanceObject, IntrinsicOptions, MashAsset, MashInstance, Time, Times, Track, VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'
import type { ServerInstance, ServerVisibleInstance } from './ServerInstanceTypes.js'
import type { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters } from '@moviemasher/runtime-server'
import type { ServerAudioAsset, ServerImageAsset, ServerVideoAsset, ServerVisibleAsset } from './ServerAssetTypes.js'

export interface ServerMashAsset extends MashAsset, ServerAsset {
  clips: ServerClips
  clipsInTimeOfType(time: Time, avType?: AVType): ServerClips
  instanceArgs(object?: InstanceObject): InstanceObject & InstanceArgs
  instanceFromObject(object?: InstanceObject): Instance
  timeRanges(avType: AVType, startTime: Time): Times
}

export interface ServerMashAudioAsset extends ServerMashAsset, ServerAudioAsset {
  instanceFromObject(object?: AudioInstanceObject): AudioInstance
}

export interface ServerMashImageAsset extends ServerMashAsset, ServerImageAsset {
  instanceFromObject(object?: InstanceObject): ImageInstance
}

export interface ServerMashVideoAsset extends ServerMashAsset, ServerVideoAsset {
  instanceFromObject(object?: VideoInstanceObject): VideoInstance
}

export interface ServerMashInstance extends MashInstance, ServerInstance {
  asset: ServerMashAsset
}

export interface ServerMashAudioInstance extends AudioInstance, ServerInstance {
  asset: ServerMashAudioAsset
}

export interface ServerMashImageInstance extends ImageInstance, ServerInstance {
  asset: ServerMashImageAsset
}

export interface ServerMashVideoInstance extends VideoInstance, ServerInstance {
  asset: ServerMashVideoAsset
}

export interface ServerClip extends Clip {
  clipCommandFiles(args: CommandFileArgs): CommandFiles
  clipCommandFilters(args: CommandFilterArgs): CommandFilters
  container?: ServerVisibleInstance
  content: ServerInstance
  intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles
}

export interface ServerClips extends Array<ServerClip>{}

export interface ServerTrack extends Track {
  clips: ServerClips
  mash: ServerMashAsset
}

export interface ServerTracks extends Array<ServerTrack>{}