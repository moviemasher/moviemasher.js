import { UnknownObject, FilesArgs, GraphFile, GraphFiles } from "../../declarations"
import { AVType, DefinitionType, LoadType } from "../../Setup/Enums"
import { Font, FontDefinition, FontObject } from "./Font"
import { FontClass } from "./FontInstance"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"

class FontDefinitionClass extends PreloadableDefinition implements FontDefinition {
  files(args: FilesArgs): GraphFiles {
    const { avType } = args
    if (avType === AVType.Audio) return []

    const graphFile: GraphFile = {
      type: LoadType.Font, file: this.source, definition: this
    }
    return [graphFile]
  }

  get instance(): Font {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : FontObject) : Font {
    return new FontClass({ ...this.instanceObject, ...object })
  }

  retain = true

  toJSON() : UnknownObject {
    return { ...super.toJSON(), source: this.source }
  }

  type = DefinitionType.Font
}

export { FontDefinitionClass }
