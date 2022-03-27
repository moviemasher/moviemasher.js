import { Any } from "../../declarations"
import { Definition } from "../../Base/Definition"
import { ModularClass, ModularDefinition } from "./Modular"
import { Definitions } from "../../Definitions/Definitions"
import { InstanceClass } from "../../Base/Instance"

function ModularMixin<T extends InstanceClass>(Base: T) : ModularClass & T {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      this.constructProperties(object)
    }

    constructProperties(object : Any = {}) : void {
      // console.log(this.constructor.name, "constructProperties", object, this.propertyNames)
      this.definition.properties.forEach(property => {
        const { name } = property
        if (typeof object[name] !== "undefined") this[name] = object[name]
        else if (typeof this[name] === "undefined") this[name] = property.value
      })
    }

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

export { ModularMixin }
