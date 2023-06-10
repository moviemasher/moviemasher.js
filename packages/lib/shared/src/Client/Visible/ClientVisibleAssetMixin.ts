import { Constrained } from '@moviemasher/runtime-shared'
import { VisibleAsset } from '../../Shared/Asset/AssetTypes.js'
import { ClientVisibleAsset } from '../Asset/ClientAsset.js'
import { ClientAsset } from "../ClientTypes.js"
import { AssetCacheArgs } from "../../Base/CacheTypes.js"

export function ClientVisibleAssetMixin
<T extends Constrained<ClientAsset & VisibleAsset>>(Base: T):
T & Constrained<ClientVisibleAsset>  {
  return class extends Base implements ClientVisibleAsset {

  }
}
