import type {GraphFiles, PreloadArgs } from '../../Base/Code.js'
import type {TweenableDefinition, TweenableDefinitionClass} from './Tweenable.js'

import {DataType, DataTypeBoolean} from '../../Setup/Enums.js'
import {MediaClass} from '../../Media/Media.js'
import {propertyInstance} from '../../Setup/Property.js'

export function TweenableDefinitionMixin<T extends MediaClass>(Base: T): TweenableDefinitionClass & T {
  return class extends Base implements TweenableDefinition {

    constructor(...args: any[]) {
      super(...args)
      this.properties.push(propertyInstance({ 
        name: 'muted', type: DataTypeBoolean 
      }))
    }
 
    graphFiles(args: PreloadArgs): GraphFiles {
      return []
    }


    loadPromise(args: PreloadArgs): Promise<void> {
      return Promise.resolve()
    }
  }
}
