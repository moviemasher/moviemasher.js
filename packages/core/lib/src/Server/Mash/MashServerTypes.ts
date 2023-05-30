import { Time, Times } from "@moviemasher/runtime-shared"
import { MashAsset, MashInstance } from "../../Shared/Mash/MashTypes.js"
import { VisibleServerAsset } from "../ServerAsset.js"
import { ServerInstance, ServerVisibleInstance } from "../ServerInstance.js"
import { AVType } from "../../Setup/AVType.js"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, GraphFiles, ServerPromiseArgs } from "../../Base/Code.js"
import { Clip, IntrinsicOptions } from "../../Shared/Mash/Clip/Clip.js"

export interface MashServerAsset extends MashAsset, VisibleServerAsset {
  timeRanges(avType: AVType, startTime: Time): Times
}

export interface MashServerInstance extends MashInstance, ServerVisibleInstance {
  asset: MashServerAsset
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
