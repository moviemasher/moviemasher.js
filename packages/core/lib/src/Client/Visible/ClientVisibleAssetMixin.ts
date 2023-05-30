import { Constrained } from '../../Base/Constrained.js'
import { VisibleAsset } from '../../Shared/Asset/Asset.js'
import { ClientVisibleAsset } from '../Asset/ClientAsset.js'
import { ClientAsset } from "../ClientTypes.js"
import { AssetCacheArgs } from '../../Base/Code.js'

export function ClientVisibleAssetMixin
<T extends Constrained<ClientAsset & VisibleAsset>>(Base: T):
T & Constrained<ClientVisibleAsset>  {
  return class extends Base implements ClientVisibleAsset {

  }
}
