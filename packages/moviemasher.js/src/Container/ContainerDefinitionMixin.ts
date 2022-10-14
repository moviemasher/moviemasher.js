import { DefinitionClass } from "../Definition/Definition"
import { DataType, DefinitionType, Orientation } from "../Setup/Enums"
import { DataGroup, propertyInstance } from "../Setup/Property"
import { ContainerDefinition, ContainerDefinitionClass } from "./Container"

export function ContainerDefinitionMixin<T extends DefinitionClass>(Base: T): ContainerDefinitionClass & T {
  return class extends Base implements ContainerDefinition {
    constructor(...args: any[]) {
      super(...args)

      this.properties.push(propertyInstance({
        name: 'lock', type: DataType.String, defaultValue: Orientation.H,
        group: DataGroup.Size, 
      }))  
    }

    type = DefinitionType.Container
  }
}
