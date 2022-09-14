import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { DefinitionType, LoadType } from "../../Setup/Enums"
import { Font, FontDefinition, FontDefinitionObject, FontObject } from "./Font"
import { FontClass } from "./FontInstance"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { UnknownObject, ValueObject } from "../../declarations"


export class FontDefinitionClass extends DefinitionBase implements FontDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { source, url } = object as FontDefinitionObject
    const sourceOrUrl = source || url || ''

    this.source = source || sourceOrUrl
    this.url = url || sourceOrUrl
  }

  family = ""

  graphFiles(args: GraphFileArgs): GraphFiles {
    const { visible, editing } = args
    if (!visible) return []

    const { url, source } = this
    const file = editing ? url : source
    const graphFile: GraphFile = {
      type: LoadType.Font, file, definition: this
    }
    return [graphFile]
  }
  instanceFromObject(object: FontObject = {}): Font {
    return new FontClass(this.instanceArgs(object))
  }

  loadType = LoadType.Font

  toJSON(): UnknownObject {
    const json = super.toJSON()
    const { url, source } = this
    json.url = url
    json.source = source
    return json
  }
  source = ''

  type = DefinitionType.Font

  url = ''
}