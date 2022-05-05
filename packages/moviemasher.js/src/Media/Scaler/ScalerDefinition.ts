import { Scaler, ScalerDefinition, ScalerObject } from "./Scaler"
import { DefinitionBase } from "../../Base/Definition"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { DefinitionType } from "../../Setup/Enums"
import { ScalerClass } from "./ScalerInstance"

const ScalerDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
export class ScalerDefinitionClass extends ScalerDefinitionWithModular implements ScalerDefinition {
  get instance() : Scaler {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : ScalerObject) : Scaler {
    const instance = new ScalerClass({ ...this.instanceObject, ...object, id: this.id })
    return instance
  }

  type = DefinitionType.Scaler
}
