import { Any, LoadPromise } from "../../../declarations"
import { Definition } from "../../Definition/Definition"
import { ModularClass, ModularDefinition } from "./Modular"
import { Definitions } from "../../Definitions"
import { InstanceClass } from "../../Instance"
import { Time } from "../../../Utilities/Time"


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

    loadModular(quantize : number, start : Time, end? : Time) : LoadPromise | void {
      const promises: LoadPromise[] = []
      const startTime = this.definitionTime(quantize, start)
      const endTime = end ? this.definitionTime(quantize, end) : end
      this.modularDefinitions.forEach(definition => {
        const promise = definition.loadDefinition(quantize, startTime, endTime)
        if (promise) promises.push(promise)
      })
      return Promise.all(promises).then()
    }

    modularUrls(quantize : number, start : Time, end? : Time) : string[] {
      const startTime = this.definitionTime(quantize, start)
      const endTime = end ? this.definitionTime(quantize, end) : end
      return this.modularDefinitions.flatMap(definition =>
        definition.definitionUrls(startTime, endTime)
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
