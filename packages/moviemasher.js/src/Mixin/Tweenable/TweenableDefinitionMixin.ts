import { MediaClass } from "../../Media/Media"
import { GraphFiles, PreloadArgs, ServerPromiseArgs } from "../../MoveMe"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { TweenableDefinition, TweenableDefinitionClass } from "./Tweenable"

export function TweenableDefinitionMixin<T extends MediaClass>(Base: T): TweenableDefinitionClass & T {
  return class extends Base implements TweenableDefinition {

    constructor(...args: any[]) {
      super(...args)
      this.properties.push(propertyInstance({ 
        name: "muted", type: DataType.Boolean 
      }))
    }
 
    graphFiles(args: PreloadArgs): GraphFiles {
      return []
    }


    loadPromise(args: PreloadArgs): Promise<void> {
      return Promise.resolve()
    }

    serverPromise(args: ServerPromiseArgs): Promise<void> {
      return Promise.resolve()
    }
  }
}
