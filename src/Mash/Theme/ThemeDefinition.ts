import { Theme, ThemeObject } from "./Theme"
import { ThemeClass } from "./ThemeInstance"
import { DefinitionClass } from "../Definition/Definition"
import { ModularDefinitionMixin } from "../Mixin/Modular/ModularDefinitionMixin"
import { ClipDefinitionMixin } from "../Mixin/Clip/ClipDefinitionMixin"
import { Any, DefinitionType } from "../../Setup"
import { Definitions } from "../Definitions/Definitions"
import { VisibleDefinitionMixin } from "../Mixin/Visible/VisibleDefinitionMixin"


const ThemeDefinitionWithModular = ModularDefinitionMixin(DefinitionClass)
const ThemeDefinitionWithClip = ClipDefinitionMixin(ThemeDefinitionWithModular)
const ThemeDefinitionWithVisible = VisibleDefinitionMixin(ThemeDefinitionWithClip)

class ThemeDefinitionClass extends ThemeDefinitionWithVisible {
  constructor(...args : Any[]) {
    super(...args)
    Definitions.install(this)
  }

  get instance() : Theme {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : ThemeObject) : Theme {
    const options = { ...this.instanceObject, ...object }
    // console.log("instanceFromObject", options)
    const instance = new ThemeClass(options)
    return instance
  }

  type = DefinitionType.Theme
}

export { ThemeDefinitionClass }
