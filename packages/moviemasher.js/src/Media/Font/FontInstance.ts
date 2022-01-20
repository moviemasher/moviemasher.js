import { InstanceBase } from "../../Base/Instance"
import { Font, FontDefinition } from "./Font"

class FontClass extends InstanceBase implements Font {
  declare definition : FontDefinition
}

export { FontClass }
