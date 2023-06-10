import { Size } from '@moviemasher/runtime-shared'
import { AssetClass } from '../../Shared/Asset/AssetClass.js'
import { ClientAsset } from '../ClientTypes.js'
import { InstanceArgs, InstanceObject } from '../../Shared/Instance/Instance.js'
import { Selectables } from '../../Plugin/Masher/Selectable.js'
import { TypeNone } from '../../Setup/EnumConstantsAndFunctions.js'
import { Actions } from '../../Plugin/Masher/Actions/Actions.js'
import { SelectedItems } from '../../Helpers/Select/SelectedProperty.js'
import { SelectorType } from '../../Setup/Enums.js'

export class ClientAssetClass extends AssetClass implements ClientAsset {
  selectables(): Selectables { return [] }
  
  selectedItems(_actions: Actions): SelectedItems { return [] }

  selectType: SelectorType = TypeNone

  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }

  definitionIcon(_size: Size): Promise<SVGSVGElement> | undefined { return }
}