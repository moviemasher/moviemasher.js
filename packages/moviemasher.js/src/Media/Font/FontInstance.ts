import { InstanceBase } from "../../Instance/InstanceBase"
import { PreloadArgs, GraphFiles } from "../../MoveMe"
import { Font, FontDefinition } from "./Font"

export class FontClass extends InstanceBase implements Font {
  declare definition: FontDefinition

  graphFiles(args: PreloadArgs): GraphFiles { 
    return this.definition.graphFiles(args)
  }
  preloadUrls(args: PreloadArgs): string[] { 
    return this.definition.preloadUrls(args)
  }
}
