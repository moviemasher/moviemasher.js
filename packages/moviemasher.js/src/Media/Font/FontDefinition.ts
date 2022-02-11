import { Any, UnknownObject, FilesArgs, GraphFile } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { AVType, DefinitionType, LoadType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time"
import { urlAbsolute } from "../../Utility/Url"
import { DefinitionBase } from "../../Base/Definition"
import { Definitions } from "../../Definitions/Definitions"
import { Font, FontDefinition, FontDefinitionObject, FontObject } from "./Font"
import { FontClass } from "./FontInstance"

class FontDefinitionClass extends DefinitionBase implements FontDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const { source, url } = <FontDefinitionObject> object
    if (!(source || url)) throw Errors.invalid.definition.source

    this.source = source || url || ''
    Definitions.install(this)
  }
  get absoluteUrl(): string { return urlAbsolute(this.source) }

  definitionUrls(_start : Time, _end? : Time) : string[] {
    return [urlAbsolute(this.source)]
  }

  files(args: FilesArgs): GraphFile[] {
    const { avType } = args
    if (avType === AVType.Audio) return []

    const graphFile: GraphFile = { type: LoadType.Font, file: this.source }
    return [graphFile]
  }

  get instance(): Font {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : FontObject) : Font {
    return new FontClass({ ...this.instanceObject, ...object })
  }

  retain = true

  source : string

  toJSON() : UnknownObject {
    return { ...super.toJSON(), source: this.source }
  }

  type = DefinitionType.Font
}

export { FontDefinitionClass }
