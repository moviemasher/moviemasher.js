import { Scaler, ScalerObject } from "./Scaler"
import { DefinitionClass } from "../Definition/Definition"
import { ModularDefinitionMixin } from "../Mixin/Modular/ModularDefinitionMixin"
import { DataType, DefinitionType } from "../../Setup/Enums"
import { Definitions } from "../Definitions/Definitions"
import { Any } from "../../declarations"
import { ScalerClass } from "./ScalerInstance"
import { Property } from "../../Setup/Property"

const ScalerDefinitionWithModular = ModularDefinitionMixin(DefinitionClass)
class ScalerDefinitionClass extends ScalerDefinitionWithModular {
  constructor(...args : Any[]) {
    super(...args)
    this.properties.push(new Property({ name: "id", type: DataType.String, value: "" }))
    Definitions.install(this)
  }

  get instance() : Scaler {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : ScalerObject) : Scaler {
    const instance = new ScalerClass({ ...this.instanceObject, ...object })
    return instance
  }

  retain = true

  type = DefinitionType.Scaler
}

export { ScalerDefinitionClass }
