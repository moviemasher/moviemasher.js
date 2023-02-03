import { ContentClass } from "../../Media/Content/Content"
import { PreloadArgs, GraphFiles } from "../../MoveMe"
import { Preloadable, PreloadableClass, PreloadableDefinition } from "./Preloadable"

export function PreloadableMixin<T extends ContentClass>(Base: T): PreloadableClass & T {
  return class extends Base implements Preloadable {
    declare definition: PreloadableDefinition
  }
}
