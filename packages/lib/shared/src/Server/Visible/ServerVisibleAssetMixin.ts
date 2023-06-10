import { Constrained } from '@moviemasher/runtime-shared';
import { VisibleAsset } from '../../Shared/Asset/AssetTypes.js';
import { ServerVisibleAsset, ServerAsset } from '../Asset/ServerAsset.js';


export function ServerVisibleAssetMixin<T extends Constrained<ServerAsset & VisibleAsset>>(Base: T):
T & Constrained<ServerVisibleAsset> {
  return class extends Base implements ServerVisibleAsset {
  };
}
