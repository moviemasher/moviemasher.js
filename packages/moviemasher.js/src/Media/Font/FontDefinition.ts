import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { DefinitionType, LoadType } from "../../Setup/Enums"
import { Font, FontDefinition, FontDefinitionObject, FontObject } from "./Font"
import { FontClass } from "./FontInstance"
import { DefinitionBase } from "../../Definition/DefinitionBase"


export class FontDefinitionClass extends DefinitionBase implements FontDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { source, url } = object as FontDefinitionObject
    const sourceOrUrl = source || url || ''

    this.source = source || sourceOrUrl
    this.url = url || sourceOrUrl
  }

  graphFiles(args: GraphFileArgs): GraphFiles {
    const { visible, editing, streaming } = args
    if (!visible) return []

    const graphFile: GraphFile = {
      localId: 'font',
      type: this.loadType,
      file: this.preloadableSource(editing),
      definition: this, options: { loop: 1 }
    }
    if (streaming) graphFile.options!.re = ''

    return [graphFile]
  }
  instanceFromObject(object: FontObject = {}): Font {
    return new FontClass(this.instanceArgs(object))
  }

  loadType = LoadType.Font

  preloadableSource(editing = false): string {
    if (!this.url) return this.source

    return editing ? this.url : this.source
  }

  source = ''

  type = DefinitionType.Font

  url = ''
}
