import { TweenableDefinitionClass } from '../../Mixin/Tweenable/Tweenable.js'
import { PreloadArgs } from '../../Base/Code.js'
import { TypeImage } from '../../Setup/Enums.js'
import { ContentDefinition, ContentDefinitionClass } from './Content.js'

export function ContentDefinitionMixin<T extends TweenableDefinitionClass>(Base: T): ContentDefinitionClass & T {
  return class extends Base implements ContentDefinition {
    loadPromise(args: PreloadArgs): Promise<void> {
      return Promise.resolve()
    }
    
    type = TypeImage

  }
}
