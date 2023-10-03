import type { Tweening } from '@moviemasher/lib-shared'
import type { GraphFile, GraphFiles, ServerAsset, ServerPromiseArgs } from '@moviemasher/runtime-server'
import type { AudibleInstance, Instance, IntrinsicOptions, CacheArgs, Size, StringDataOrError, StringsDataOrError, Value, VisibleInstance } from '@moviemasher/runtime-shared'
import type { CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '@moviemasher/runtime-server'
import type { ServerAudibleAsset, ServerVisibleAsset } from './ServerAssetTypes.js'

export interface ServerInstance extends Instance {
  alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters
  amixCommandFilters(args: CommandFilterArgs): CommandFilters
  asset: ServerAsset
  audibleCommandFiles(args: CommandFileArgs): CommandFiles
  audibleCommandFilters(args: CommandFilterArgs): CommandFilters
  canColor(args: CommandFilterArgs): boolean
  canColorTween(args: CommandFilterArgs): boolean
  colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string, intrinsicSize?: Size): CommandFilters
  colorCommandFilters(duration: number, videoRate: number, size: Size, sizeEnd: Size, color: Value, colorEnd: Value): CommandFilters 
  colorizeCommandFilters(args: CommandFilterArgs): CommandFilters 
  colorMaximize: boolean
  commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters
  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters
  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters
  containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters
  contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters
  copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter
  fileCommandFiles(graphFileArgs: CacheArgs): CommandFiles
  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters
  intrinsicGraphFile(options: IntrinsicOptions): GraphFile
  opacityCommandFilters(args: CommandFilterArgs): CommandFilters
  overlayCommandFilters(bottomInput: string, topInput: string, alpha?: boolean): CommandFilters
  scaleCommandFilters(args: CommandFilterArgs): CommandFilters
  translateCommandFilters(args: CommandFilterArgs): CommandFilters
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles
}

export interface ServerAudibleInstance extends ServerInstance, AudibleInstance {
  asset: ServerAudibleAsset
}

export interface ServerVisibleInstance extends ServerInstance, VisibleInstance {
  asset: ServerVisibleAsset
}
