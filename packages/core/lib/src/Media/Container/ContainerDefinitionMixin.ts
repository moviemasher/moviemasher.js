import type { ContainerDefinition, ContainerDefinitionClass } from './Container.js'
import type { PreloadArgs } from '../../Base/Code.js'

import type { TweenableDefinitionClass } from '../../Mixin/Tweenable/Tweenable.js'
import { TypeImage, LockWidth, DataTypeString } from '../../Setup/Enums.js'
import { DataGroupSize, propertyInstance } from '../../Setup/Property.js'

export function ContainerDefinitionMixin<T extends TweenableDefinitionClass>(Base: T): ContainerDefinitionClass & T {
  return class extends Base implements ContainerDefinition {
    constructor(...args: any[]) {
      super(...args)

      this.properties.push(propertyInstance({
        name: 'lock', type: DataTypeString, defaultValue: LockWidth,
        group: DataGroupSize, 
      }))  
    }
   
    loadPromise(args: PreloadArgs): Promise<void> {
      return Promise.resolve()
    }


    type = TypeImage 
  }
}
