import { Theme, ThemeDefinition, ThemeObject } from "./Theme"
import { ThemeClass } from "./ThemeClass"
import { DefinitionBase } from "../../Base/Definition"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { DefinitionType } from "../../Setup/Enums"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"


const WithModularDefinition = ModularDefinitionMixin(DefinitionBase)
const WithClipDefinition = ClipDefinitionMixin(WithModularDefinition)
const WithVisibleDefinition = VisibleDefinitionMixin(WithClipDefinition)
const WithTransformableDefinition = TransformableDefinitionMixin(WithVisibleDefinition)

class ThemeDefinitionClass extends WithTransformableDefinition implements ThemeDefinition {
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
