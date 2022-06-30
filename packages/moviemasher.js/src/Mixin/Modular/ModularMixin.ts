import { ModularClass, ModularDefinition } from "./Modular"
import { InstanceClass } from "../../Instance/Instance"
// import { ChainLinks } from "../../Filter/Filter"


export function ModularMixin<T extends InstanceClass>(Base: T) : ModularClass & T {
  return class extends Base {

    // chainLinks(): ChainLinks { return [] }

    declare definition : ModularDefinition
  }
}
