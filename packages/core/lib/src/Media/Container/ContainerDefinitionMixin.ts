import type { ContainerDefinition, ContainerDefinitionClass } from './Container.js'
import type { PreloadArgs } from '../../Base/Code.js'

import { TweenableDefinitionClass } from '../../Mixin/Tweenable/Tweenable.js'
import { DataType, TypeImage, Orientation } from '../../Setup/Enums.js'
import { DataGroup, propertyInstance } from '../../Setup/Property.js'

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


    type = TypeImage 
  }
}
