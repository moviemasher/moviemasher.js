import { ModularClass, ModularDefinition } from "./Modular"
import { InstanceClass } from "../../Base/Instance"

export function ModularMixin<T extends InstanceClass>(Base: T) : ModularClass & T {
  return class extends Base {
    declare definition : ModularDefinition
  }
}
