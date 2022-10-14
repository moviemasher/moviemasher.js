import { ContentClass } from "../../Content/Content"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { Preloadable, PreloadableClass, PreloadableDefinition } from "./Preloadable"

export function PreloadableMixin<T extends ContentClass>(Base: T): PreloadableClass & T {
  return class extends Base implements Preloadable {
    declare definition: PreloadableDefinition
  }
}
