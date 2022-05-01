import { Definition } from "../../Base/Definition"
import { ModularClass, ModularDefinition } from "./Modular"
import { Definitions } from "../../Definitions/Definitions"
import { InstanceClass } from "../../Base/Instance"

export function ModularMixin<T extends InstanceClass>(Base: T) : ModularClass & T {
  return class extends Base {
    declare definition : ModularDefinition

    get definitions() : Definition[] {
      return [...super.definitions, ...this.modularDefinitions]
    }

    private get modularDefinitions() : Definition[] {
      const modular = this.definition.propertiesModular
      const ids = modular.map(property => String(this.value(property.name)))
      return ids.map(id => Definitions.fromId(id))
    }
  }
}
