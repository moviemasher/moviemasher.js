import { Constrained } from '../Base/Constrained.js';
import { AudibleAsset } from '../Shared/Asset/Asset.js';
import { ServerAsset, AudibleServerAsset } from './ServerAsset.js';


export function AudibleServerAssetMixin<T extends Constrained<ServerAsset & AudibleAsset>>(Base: T):
T & Constrained<AudibleServerAsset> {
  return class extends Base implements AudibleServerAsset {
  };
}
