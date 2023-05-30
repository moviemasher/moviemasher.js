import { Constrained } from '../Base/Constrained.js';
import { VisibleAsset } from '../Shared/Asset/Asset.js';
import { VisibleServerAsset, ServerAsset } from './ServerAsset.js';


export function VisibleServerAssetMixin<T extends Constrained<ServerAsset & VisibleAsset>>(Base: T):
T & Constrained<VisibleServerAsset> {
  return class extends Base implements VisibleServerAsset {
  };
}
