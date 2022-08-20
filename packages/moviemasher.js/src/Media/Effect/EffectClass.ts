import { EffectDefinition } from "./Effect"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { Actions, Selectables } from "../../Editor"
import { SelectedItems } from "../../Utility/SelectedProperty"
import { ActionType, SelectType } from "../../Setup/Enums"
import { Scalar } from "../../declarations"
import { assertPopulatedString, isUndefined } from "../../Utility/Is"

const EffectWithModular = ModularMixin(InstanceBase)
export class EffectClass extends EffectWithModular {
  declare definition: EffectDefinition

  selectables(): Selectables { return [] }

  selectType = SelectType.None

  selectedItems(actions: Actions): SelectedItems {
    return this.properties.map(property => { 
      const undoValue = this.value(property.name)
      const target = this
      return {
        value: undoValue,
        selectType: SelectType.None, property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)
      
          const options = { target, property, redoValue, undoValue }
          actions.create(options)
        }
      }
    })
  }
}
