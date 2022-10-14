import { TweenableDefinitionClass } from "../Mixin/Tweenable/Tweenable"
import { DefinitionType } from "../Setup/Enums"
import { ContentDefinition, ContentDefinitionClass } from "./Content"

export function ContentDefinitionMixin<T extends TweenableDefinitionClass>(Base: T): ContentDefinitionClass & T {
  return class extends Base implements ContentDefinition {

    type = DefinitionType.Content
  }
}
