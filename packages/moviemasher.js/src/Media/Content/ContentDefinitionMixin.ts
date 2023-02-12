import { TweenableDefinitionClass } from "../../Mixin/Tweenable/Tweenable"
import { PreloadArgs } from "../../Base/Code"
import { ImageType, MediaType } from "../../Setup/Enums"
import { ContentDefinition, ContentDefinitionClass } from "./Content"

export function ContentDefinitionMixin<T extends TweenableDefinitionClass>(Base: T): ContentDefinitionClass & T {
  return class extends Base implements ContentDefinition {
    loadPromise(args: PreloadArgs): Promise<void> {
      return Promise.resolve()
    }
    
    type = ImageType

  }
}
