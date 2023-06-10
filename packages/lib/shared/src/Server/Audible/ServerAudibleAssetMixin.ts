import { Constrained } from '@moviemasher/runtime-shared';
import { AudibleAsset } from '../../Shared/Asset/AssetTypes.js';
import { ServerAsset, ServerAudibleAsset } from '../Asset/ServerAsset.js';


export function ServerAudibleAssetMixin<T extends Constrained<ServerAsset & AudibleAsset>>(Base: T):
T & Constrained<ServerAudibleAsset> {
  return class extends Base implements ServerAudibleAsset {
  };
}
