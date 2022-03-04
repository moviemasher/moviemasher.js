import { Any, FilesArgs, GraphFile } from "../declarations"
import { GraphType } from "../Setup/Enums"
import { DefinitionBase, DefinitionObject } from "./Definition"


class PreloadableDefinition extends DefinitionBase {
  constructor(...args: Any[]) {
    super(...args)

    const [object] = args
    const { source } = <DefinitionObject> object
    if (source) this.source = source
  }

  preloadableSource(graphType: GraphType): string {
    return this.source
  }

  source = ''
}

export { PreloadableDefinition }
