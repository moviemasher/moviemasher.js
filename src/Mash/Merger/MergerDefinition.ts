import { MergerClass } from "./MergerInstance"
import { DefinitionClass } from "../Definition/Definition"
import { Merger, MergerObject } from "./Merger"
import { ModularDefinitionMixin } from "../Mixin/Modular/ModularDefinitionMixin"
import { Any } from "../../Setup/declarations"
import { DataType, DefinitionType } from "../../Setup/Enums"
import { Property } from "../../Setup/Property"

import { Definitions } from "../Definitions/Definitions"

const MergerDefinitionWithModular = ModularDefinitionMixin(DefinitionClass)
class MergerDefinitionClass extends MergerDefinitionWithModular {
  constructor(...args : Any[]) {
    super(...args)
    this.properties.push(new Property({ name: "id", type: DataType.String, value: "" }))
    Definitions.install(this)
  }

  get instance() : Merger {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : MergerObject) : Merger {
    const instance = new MergerClass({ ...this.instanceObject, ...object })
    return instance
  }
  retain = true

  type = DefinitionType.Merger
}

export { MergerDefinitionClass }
