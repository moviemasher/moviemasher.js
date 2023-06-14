import { Size } from '@moviemasher/runtime-shared'
import { AssetClass } from '../../Shared/Asset/AssetClass.js'
import { ClientAsset } from "@moviemasher/runtime-client"
import { InstanceArgs, InstanceObject } from '@moviemasher/runtime-shared'
import { Selectables } from '@moviemasher/runtime-client'
import { TypeNone } from '../../Setup/EnumConstantsAndFunctions.js'
import { Actions } from "@moviemasher/runtime-client"
import { SelectedProperties } from '@moviemasher/runtime-client'
import { SelectorType } from "@moviemasher/runtime-client"

export class ClientAssetClass extends AssetClass implements ClientAsset {
  selectables(): Selectables { return [] }
  
  selectedItems(_actions: Actions): SelectedProperties { return [] }

  selectType: SelectorType = TypeNone

  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }

  definitionIcon(_size: Size): Promise<SVGSVGElement> | undefined { return }
}