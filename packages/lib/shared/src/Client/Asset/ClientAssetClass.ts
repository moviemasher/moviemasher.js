import type { Actions, ClientAsset, Selectables, SelectedProperties, SelectorType } from '@moviemasher/runtime-client'
import type { InstanceArgs, InstanceObject, Size } from '@moviemasher/runtime-shared'
import { AssetClass } from '../../Shared/Asset/AssetClass.js'


import { TypeNone } from '../../Setup/TypeConstants.js'

export class ClientAssetClass extends AssetClass implements ClientAsset {
  selectables(): Selectables { return [] }
  
  selectedItems(_actions: Actions): SelectedProperties { return [] }

  selectType: SelectorType = TypeNone

  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }

  definitionIcon(_size: Size): Promise<SVGSVGElement> | undefined { return }
}
