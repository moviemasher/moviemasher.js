import type { Time, Times } from '@moviemasher/runtime-shared'
import type { MashAsset, MashInstance } from '@moviemasher/runtime-shared'
import type { ServerAudioAsset, ServerImageAsset, ServerVideoAsset, ServerVisibleAsset } from '../Asset/ServerAssetTypes.js'
import type { ServerInstance, ServerVisibleInstance } from '../ServerInstance.js'
import type { AVType } from '@moviemasher/runtime-shared'
import type { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters } from '../CommandFile.js'
import type { GraphFiles, ServerPromiseArgs } from "@moviemasher/runtime-server"
import type { Clip, IntrinsicOptions } from '@moviemasher/runtime-shared'
import type { Track } from '@moviemasher/runtime-shared'
import type { ServerAssetManager } from '@moviemasher/runtime-server'
import type { Instance, InstanceArgs, InstanceObject } from '@moviemasher/runtime-shared'
import type { AudioInstance, AudioInstanceObject } from '@moviemasher/runtime-shared'
import type { ImageInstance } from '@moviemasher/runtime-shared'
import type { VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'

export interface ServerMashAsset extends MashAsset, ServerVisibleAsset {


  instanceFromObject(object?: InstanceObject): Instance
  instanceArgs(object?: InstanceObject): InstanceObject & InstanceArgs
  
  
  timeRanges(avType: AVType, startTime: Time): Times
  clips: ServerClips
  clipsInTimeOfType(time: Time, avType?: AVType): ServerClips
  media: ServerAssetManager
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

export interface ServerMashInstance extends MashInstance, ServerVisibleInstance {
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
  commandFilters(args: CommandFilterArgs): CommandFilters
  container?: ServerVisibleInstance
  content: ServerInstance
  intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles
  serverPromise(args: ServerPromiseArgs): Promise<void>

}

export type ServerClips = ServerClip[]

export interface ServerTrack extends Track {
  clips: ServerClips
  mash: ServerMashAsset
}

export type ServerTracks = ServerTrack[]