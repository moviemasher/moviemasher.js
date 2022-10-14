import { InstanceBase } from "../../Instance/InstanceBase"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { Font, FontDefinition } from "./Font"

export class FontClass extends InstanceBase implements Font {
  declare definition: FontDefinition

  fileUrls(args: GraphFileArgs): GraphFiles { 
    return this.definition.fileUrls(args)
  }
}
