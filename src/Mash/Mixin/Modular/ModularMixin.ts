import { Any, Constrained, LoadPromise } from "../../../declarations"
import { Definition } from "../../Definition/Definition"
import { ModularDefinition } from "./Modular"
import { Definitions } from "../../Definitions"
import { Instance } from "../../Instance"
import { Time } from "../../../Utilities/Time"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ModularMixin<TBase extends Constrained<Instance>>(Base: TBase) {
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

    load(quantize : number, start : Time, end? : Time) : LoadPromise {
      const promises = [super.load(quantize, start, end)]
      const startTime = this.definitionTime(quantize, start)
      const endTime = end ? this.definitionTime(quantize, end) : end
      this.modularDefinitions.forEach(definition => {
        promises.push(definition.load(startTime, endTime))
      })
      return Promise.all(promises).then()
    }

    loaded(quantize : number, start : Time, end? : Time) : boolean {
      if (!super.load(quantize, start, end)) return false

      const startTime = this.definitionTime(quantize, start)
      const endTime = end ? this.definitionTime(quantize, end) : end
      return this.modularDefinitions.every(definition =>
        definition.loaded(startTime, endTime)
      )
    }

    get modularDefinitions() : Definition[] {
      const modular = this.definition.propertiesModular
      const ids = modular.map(property => String(this.value(property.name)))
      return ids.map(id => Definitions.fromId(id))
    }
  }
}

export { ModularMixin }
