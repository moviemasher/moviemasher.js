import { InstanceBase } from "../../Base/Instance"
import { Font, FontDefinition } from "./Font"

export class FontClass extends InstanceBase implements Font {
  declare definition : FontDefinition
}
