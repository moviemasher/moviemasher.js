import { DefinitionClass } from "../Definition/Definition"
import { ContainerDefinition, ContainerDefinitionClass } from "./Container"

export function ContainerDefinitionMixin<T extends DefinitionClass>(Base: T): ContainerDefinitionClass & T {
  return class extends Base implements ContainerDefinition {}
}
