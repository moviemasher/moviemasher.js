import { TweenableDefinitionClass } from "../../Mixin/Tweenable/Tweenable"
import { PreloadArgs } from "../../Base/Code"
import { DataType, ImageType, MediaType, Orientation } from "../../Setup/Enums"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { ContainerDefinition, ContainerDefinitionClass } from "./Container"

export function ContainerDefinitionMixin<T extends TweenableDefinitionClass>(Base: T): ContainerDefinitionClass & T {
  return class extends Base implements ContainerDefinition {
    constructor(...args: any[]) {
      super(...args)

      this.properties.push(propertyInstance({
        name: 'lock', type: DataType.String, defaultValue: Orientation.H,
        group: DataGroup.Size, 
      }))  
    }
   
    loadPromise(args: PreloadArgs): Promise<void> {
      return Promise.resolve()
    }


    type = ImageType 
  }
}
