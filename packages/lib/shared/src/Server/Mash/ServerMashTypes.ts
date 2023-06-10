import { Time, Times } from "@moviemasher/runtime-shared"
import { MashAsset, MashInstance } from "../../Shared/Mash/MashTypes.js"
import { ServerVisibleAsset } from "../Asset/ServerAsset.js"
import { ServerInstance, ServerVisibleInstance } from "../ServerInstance.js"
import { AVType } from "../../Setup/AVType.js"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, GraphFiles, ServerPromiseArgs } from "../GraphFile.js"
import { Clip, IntrinsicOptions } from "../../Shared/Mash/Clip/Clip.js"
import { Track } from "../../Shared/Mash/Track/Track.js"
import { ServerAssetManager } from "../Asset/AssetManager/ServerAssetManager.js"

export interface ServerMashAsset extends MashAsset, ServerVisibleAsset {
  timeRanges(avType: AVType, startTime: Time): Times
  clips: ServerClips
  clipsInTimeOfType(time: Time, avType?: AVType): ServerClips
  media: ServerAssetManager
}

export interface ServerMashInstance extends MashInstance, ServerVisibleInstance {
  asset: ServerMashAsset
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