import { Constrained } from '@moviemasher/runtime-shared';
import { AudibleAsset } from '@moviemasher/runtime-shared';
import { ServerAudibleAsset } from '../Asset/ServerAssetTypes.js';
import { ServerAsset } from "@moviemasher/runtime-server";


export function ServerAudibleAssetMixin<T extends Constrained<ServerAsset & AudibleAsset>>(Base: T):
T & Constrained<ServerAudibleAsset> {
  return class extends Base implements ServerAudibleAsset {
  };
}
