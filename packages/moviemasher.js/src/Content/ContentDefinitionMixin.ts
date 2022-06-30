import { TweenableDefinitionClass } from "../Mixin/Tweenable/Tweenable"
import { ContentDefinition, ContentDefinitionClass } from "./Content"

export function ContentDefinitionMixin<T extends TweenableDefinitionClass>(Base: T): ContentDefinitionClass & T {
  return class extends Base implements ContentDefinition {}
}
