import { DefinitionClass } from "../Definition/Definition"
import { FilterDefinition } from "../Filter/Filter"
import { filterDefinitionFromId } from "../Filter/FilterFactory"
import { ContainerDefinition, ContainerDefinitionClass } from "./Container"

export function ContainerDefinitionMixin<T extends DefinitionClass>(Base: T): ContainerDefinitionClass & T {
  return class extends Base implements ContainerDefinition {
    constructor(...args: any[]) {
      super(...args)
      this.overlayFilterDefinition = filterDefinitionFromId('overlay')
      this.opacityFilterDefinition = filterDefinitionFromId('opacity')
      this.blendFilterDefinition = filterDefinitionFromId('blend')
      this.scaleFilterDefinition = filterDefinitionFromId('scale')
      this.setsarFilterDefinition = filterDefinitionFromId('setsar')
      
      this.properties.push(...this.blendFilterDefinition.properties)
      this.properties.push(...this.opacityFilterDefinition.properties)
      this.properties.push(...this.overlayFilterDefinition.properties)
    }



    blendFilterDefinition: FilterDefinition

    opacityFilterDefinition: FilterDefinition

    scaleFilterDefinition: FilterDefinition
    setsarFilterDefinition: FilterDefinition
    overlayFilterDefinition: FilterDefinition
  }
}
