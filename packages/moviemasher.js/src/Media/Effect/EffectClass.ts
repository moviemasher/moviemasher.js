import { EffectDefinition } from "./Effect"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { Actions } from "../../Editor"
import { SelectedItems } from "../../Utility/SelectedProperty"
import { ActionType, SelectType } from "../../Setup/Enums"
import { Scalar } from "../../declarations"
import { assertPopulatedString, isUndefined } from "../../Utility/Is"

const EffectWithModular = ModularMixin(InstanceBase)
export class EffectClass extends EffectWithModular {
  declare definition: EffectDefinition
  selectType = SelectType.None

  selectedItems(actions: Actions): SelectedItems {
    return this.properties.map(property => ({
      selectType: SelectType.None, property, 
      value: this.value(property.name),
      changeHandler: (property: string, value: Scalar) => {
        assertPopulatedString(property)
    
        const redoValue = isUndefined(value) ? this.value(property) : value
        const undoValue = this.value(property)
        const options = {
          type: ActionType.Change, target: this, property, redoValue, undoValue
        }
        actions.create(options)
      }
    }))
  }
  
}
