import { Theme, ThemeDefinition, ThemeObject } from "./Theme"
import { ThemeClass } from "./ThemeInstance"
import { DefinitionBase } from "../../Base/Definition"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { Any } from "../../declarations"
import { Definitions } from "../../Definitions/Definitions"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { DefinitionType } from "../../Setup/Enums"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"


const WithModular = ModularDefinitionMixin(DefinitionBase)
const WithClip = ClipDefinitionMixin(WithModular)
const WithVisible = VisibleDefinitionMixin(WithClip)
const WithTransformable = TransformableDefinitionMixin(WithVisible)

class ThemeDefinitionClass extends WithTransformable implements ThemeDefinition {
  constructor(...args : Any[]) {
    super(...args)
    Definitions.install(this)
  }

  get instance() : Theme {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object: ThemeObject): Theme {
    const { instanceObject } = this
    const options = { ...instanceObject, ...object }
    return new ThemeClass(options)
  }

  type = DefinitionType.Theme
}

export { ThemeDefinitionClass }
