import { InstanceBase } from "../../Instance/InstanceBase"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { Font, FontDefinition } from "./Font"

export class FontClass extends InstanceBase implements Font {
  declare definition: FontDefinition

  graphFiles(args: GraphFileArgs): GraphFiles { return this.definition.graphFiles(args)}
}
