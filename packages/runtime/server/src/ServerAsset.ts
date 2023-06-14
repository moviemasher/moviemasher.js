import type { GraphFiles, ServerPromiseArgs } from "./GraphFile.js";
import type { PreloadArgs } from "@moviemasher/runtime-shared";
import type { Asset } from '@moviemasher/runtime-shared';


export interface ServerAsset extends Asset {
  graphFiles(args: PreloadArgs): GraphFiles;
  serverPromise(args: ServerPromiseArgs): Promise<void>;
}

export type ServerAssets = ServerAsset[];
