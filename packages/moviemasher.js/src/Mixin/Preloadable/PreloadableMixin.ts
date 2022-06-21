import { InstanceClass } from "../../Instance/Instance"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { Preloadable, PreloadableClass, PreloadableDefinition } from "./Preloadable"

export function PreloadableMixin<T extends InstanceClass>(Base: T): PreloadableClass & T {
  return class extends Base implements Preloadable {
    graphFiles(args: GraphFileArgs): GraphFiles {
      return this.definition.graphFiles(args)
    }

    declare definition: PreloadableDefinition
  }
}
