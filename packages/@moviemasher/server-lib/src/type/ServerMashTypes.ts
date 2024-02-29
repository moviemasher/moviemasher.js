import type { AbsolutePath, AudioInstance, Clip, AudioCommandFileOptions, CommandFiles, ImageInstance, MashAsset, MashAudioAssetObject, MashImageAssetObject, VideoCommandFileOptions, MashInstance, MashVideoAssetObject, ServerAsset, ServerInstance, Track, VideoInstance } from '@moviemasher/shared-lib/types.js'
import type { AudibleCommandFilterArgs, CommandFilters, ServerContainerInstance, ServerContentInstance, ServerMashDescription, ServerMashDescriptionOptions, VideoCommandFilterArgs } from '../types.js'
import type { ServerAudioAsset, ServerImageAsset, ServerVideoAsset } from './ServerAssetTypes.js'

export interface ServerMashAsset extends MashAsset, ServerAsset {
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
  container?: ServerContainerInstance
  content: ServerContentInstance
}

export interface ServerClips extends Array<ServerClip>{}

export interface ServerTrack extends Track {
  clips: ServerClips
  mash: ServerMashAsset
}

export interface ServerTracks extends Array<ServerTrack>{}