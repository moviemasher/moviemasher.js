import { Effect, EffectDefinition } from "./Effect"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { Actions } from "../../Editor"
import { SelectedProperties } from "../../Utility/SelectedProperty"
import { ActionType, SelectType } from "../../Setup/Enums"
import { Scalar } from "../../declarations"
import { assertPopulatedString, isUndefined } from "../../Utility/Is"

const EffectWithModular = ModularMixin(InstanceBase)
export class EffectClass extends EffectWithModular {
  declare definition: EffectDefinition

  selectedProperties(actions: Actions): SelectedProperties {
    return this.properties.map(property => ({
      selectType: SelectType.Cast, property, 
      value: this.value(property.name),
      changeHandler: property => ({
        selectType: SelectType.Effect, property, 
        changeHandler: (property: string, value: Scalar, effect?: Effect) => {
          assertPopulatedString(property)
      
          const redoValue = isUndefined(value) ? this.value(property) : value
          const undoValue = this.value(property)
          const options = {
            type: ActionType.Change, target: this, property, redoValue, undoValue
          }
          actions.create(options)
        },
      })
    }))
  }
}
