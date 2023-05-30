import type { ServerAsset, AudibleServerAsset, VisibleServerAsset } from "./ServerAsset.js";
import type { CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, GraphFile, GraphFiles, PreloadArgs, ServerPromiseArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '../Base/Code.js';
import type { IntrinsicOptions } from '../Shared/Mash/Clip/Clip.js';
import type { Tweening } from '../Helpers/TweenFunctions.js';
import { AudibleInstance, Instance, VisibleInstance } from '../Shared/Instance/Instance.js';

export interface ServerInstance extends Instance {
  alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters;
  amixCommandFilters(args: CommandFilterArgs): CommandFilters;
  asset: ServerAsset;

  audibleCommandFiles(args: CommandFileArgs): CommandFiles
  audibleCommandFilters(args: CommandFilterArgs): CommandFilters
  canColor(args: CommandFilterArgs): boolean;
  canColorTween(args: CommandFilterArgs): boolean;
  colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string): CommandFilters;
  colorizeCommandFilters(args: CommandFilterArgs): CommandFilters 
  colorMaximize: boolean
  commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters;
  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
  containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters;
  contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters;
  copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter;
  effectsCommandFiles(args: VisibleCommandFileArgs): CommandFiles
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
  asset: AudibleServerAsset
}
export interface ServerVisibleInstance extends ServerInstance, VisibleInstance {
  asset: VisibleServerAsset
}
