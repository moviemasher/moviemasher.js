import type { ServerAudibleAsset, ServerVisibleAsset } from "./Asset/ServerAssetTypes.js";
import type { ServerAsset } from "@moviemasher/runtime-server";
import type { CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs, VisibleCommandFilterArgs } from './CommandFile.js';
import type { GraphFile, GraphFiles, ServerPromiseArgs } from "@moviemasher/runtime-server";
import type { PreloadArgs, Size, Value } from "@moviemasher/runtime-shared";
import type { IntrinsicOptions } from '@moviemasher/runtime-shared';
import type { Tweening } from '../Shared/Utility/Tween/Tweening.js';
import { AudibleInstance, Instance, VisibleInstance } from '@moviemasher/runtime-shared';

export interface ServerInstance extends Instance {
  alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters;
  amixCommandFilters(args: CommandFilterArgs): CommandFilters;
  asset: ServerAsset;

  audibleCommandFiles(args: CommandFileArgs): CommandFiles
  audibleCommandFilters(args: CommandFilterArgs): CommandFilters
  canColor(args: CommandFilterArgs): boolean;
  canColorTween(args: CommandFilterArgs): boolean;
  colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string): CommandFilters;
  colorCommandFilters(duration: number, videoRate: number, size: Size, sizeEnd: Size, color: Value, colorEnd: Value): CommandFilters 
  colorizeCommandFilters(args: CommandFilterArgs): CommandFilters 
  colorMaximize: boolean
  commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters;
  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
  containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
  contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
  copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter;
  fileCommandFiles(graphFileArgs: PreloadArgs): CommandFiles;
  graphFiles(args: PreloadArgs): GraphFiles;
  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters;
  intrinsicGraphFile(options: IntrinsicOptions): GraphFile;
  opacityCommandFilters(args: CommandFilterArgs): CommandFilters
  overlayCommandFilters(bottomInput: string, topInput: string, alpha?: boolean): CommandFilters;
  scaleCommandFilters(args: CommandFilterArgs): CommandFilters;
  translateCommandFilters(args: CommandFilterArgs): CommandFilters
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles
  serverPromise(args: ServerPromiseArgs): Promise<void> 
}

export interface ServerAudibleInstance extends ServerInstance, AudibleInstance {
  asset: ServerAudibleAsset
}
export interface ServerVisibleInstance extends ServerInstance, VisibleInstance {
  asset: ServerVisibleAsset
}
