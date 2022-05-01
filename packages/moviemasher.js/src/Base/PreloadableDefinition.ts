import { Any, UnknownObject } from "../declarations"
import { GraphType, LoadType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { DefinitionBase, DefinitionObject } from "./Definition"

export class PreloadableDefinition extends DefinitionBase {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const { source, url } = <DefinitionObject>object
    const sourceOrUrl = source || url || ''
    if (!sourceOrUrl) throw Errors.invalid.url

    this.source = source || sourceOrUrl
    this.url = url || sourceOrUrl
  }

  loadType!: LoadType

  preloadableSource(graphType: GraphType): string {
    if (!this.url) return this.source

    const source = graphType === GraphType.Canvas ? this.url : this.source
    // console.log(this.constructor.name, "preloadableSource", source)
    return source
  }

  source: string



  toJSON(): UnknownObject {
    const object = super.toJSON()
    if (this.url) object.url = this.url
    if (this.source) object.source = this.source
    return object
  }

  url: string
}
