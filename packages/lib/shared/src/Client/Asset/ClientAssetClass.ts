import type { Actions, ClientAsset, Selectables, SelectedProperties, SelectedProperty } from '@moviemasher/runtime-client'
import { DotChar, PropertyId, type InstanceArgs, type InstanceObject, type Scalar, type Size, type Strings, type TargetId, TargetIds, PropertyIds } from '@moviemasher/runtime-shared'
import { AssetClass } from '../../Shared/Asset/AssetClass.js'

import { TypeAsset } from '@moviemasher/runtime-client'
import { assertDefined, assertPopulatedString } from '../../Shared/SharedGuards.js'
import { ChangePropertyActionObject } from '../Masher/Actions/Action/ActionTypes.js'
import { ActionTypeChange } from '../../Setup/ActionTypeConstants.js'

export class ClientAssetClass extends AssetClass implements ClientAsset {
  definitionIcon(_size: Size): Promise<SVGSVGElement> | undefined { return }
  
  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }

  selectables(): Selectables { return [] }
  
  selectedProperties(actions: Actions, propertyNames: Strings): SelectedProperties {
    const names = this.selectorTypesPropertyNames(propertyNames, this.targetId)
  
    return names.map(name => {
      const property = this.propertyFind(name)
      assertDefined(property)

      const { targetId } = property
      const propertyId = [targetId, name].join(DotChar) as PropertyId

      const undoValue = this.value(property.name)
      const selectedProperty: SelectedProperty = {
        value: undoValue,
        propertyId, 
        property, 
        changeHandler: (property: string, redoValue?: Scalar) => {
          assertPopulatedString(property)

          const options: ChangePropertyActionObject = { 
            type: ActionTypeChange,
            property, target: this, redoValue, undoValue,
            redoSelection: actions.selection,
            undoSelection: actions.selection,
          }
          actions.create(options)
        }
      }
      return selectedProperty
    })
  }

  targetId: TargetId = TypeAsset
}
