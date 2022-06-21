import { DefinitionClass } from "../Definition/Definition"
import { ContentDefinition, ContentDefinitionClass } from "./Content"

export function ContentDefinitionMixin<T extends DefinitionClass>(Base: T): ContentDefinitionClass & T {
  return class extends Base implements ContentDefinition {


  }
}
