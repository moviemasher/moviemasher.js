import { FilesArgs, GraphFile, GraphFiles } from "../../declarations"
import { AVType, DefinitionType, LoadType } from "../../Setup/Enums"
import { Font, FontDefinition, FontObject } from "./Font"
import { FontClass } from "./FontInstance"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"

export class FontDefinitionClass extends PreloadableDefinition implements FontDefinition {
  definitionFiles(args: FilesArgs): GraphFiles {
    const { avType, graphType } = args
    if (avType === AVType.Audio) return []

    const graphFile: GraphFile = {
      type: this.loadType, file: this.preloadableSource(graphType), definition: this
    }
    return [graphFile]
  }

  get instance(): Font {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : FontObject) : Font {
    return new FontClass({ ...this.instanceObject, ...object })
  }

  loadType = LoadType.Font

  type = DefinitionType.Font
}
