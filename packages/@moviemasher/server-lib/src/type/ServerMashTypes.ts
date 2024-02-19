import type { AVType, AbsolutePath, AudioInstance, Clip, ContainerInstance, ContentInstance, ImageInstance, MashAsset, MashAudioAssetObject, MashImageAssetObject, MashInstance, MashVideoAssetObject, Time, Track, VideoInstance } from '@moviemasher/shared-lib/types.js'
import type { AudibleCommandFilterArgs, AudioCommandFileOptions, CommandFiles, CommandFilters, ServerAsset, ServerAssetManager, ServerAudioInstance, ServerInstance, ServerMashDescription, ServerMashDescriptionOptions, ServerVisibleInstance, VideoCommandFileOptions, VideoCommandFilterArgs } from '../types.js'
import type { ServerAudioAsset, ServerImageAsset, ServerVideoAsset } from './ServerAssetTypes.js'

export interface ServerMashAsset extends MashAsset, ServerAsset {
  clips: ServerClips
  clipsInTimeOfType(time: Time, avType?: AVType): ServerClips
  mashDescription(options: ServerMashDescriptionOptions): ServerMashDescription
}

export interface ServerMashAudioAsset extends ServerMashAsset, ServerAudioAsset {
  assetObject: MashAudioAssetObject
}

export interface ServerMashImageAsset extends ServerMashAsset, ServerImageAsset {
  assetObject: MashImageAssetObject
}

export interface ServerMashVideoAsset extends ServerMashAsset, ServerVideoAsset {
  assetObject: MashVideoAssetObject
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
  requiresPrecoding: boolean
  precoding?: AbsolutePath
  videoCommandFiles(args: VideoCommandFileOptions): CommandFiles
  audioCommandFiles(args: AudioCommandFileOptions): CommandFiles
  videoCommandFilters(args: VideoCommandFilterArgs): CommandFilters
  audioCommandFilters(args: AudibleCommandFilterArgs): CommandFilters
  container?: ServerVisibleInstance & ContainerInstance
  content: ServerInstance & ContentInstance | ServerAudioInstance
}

export interface ServerClips extends Array<ServerClip>{}

export interface ServerTrack extends Track {
  clips: ServerClips
  mash: ServerMashAsset
}

export interface ServerTracks extends Array<ServerTrack>{}