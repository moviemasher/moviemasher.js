import { UnknownObject } from "../../declarations"
import { LoadType } from "../../Setup/Enums"
import {
  PreloadableDefinition, PreloadableDefinitionClass, PreloadableDefinitionObject
} from "./Preloadable"
import { ContentDefinitionClass } from "../../Content/Content"

export function PreloadableDefinitionMixin<T extends ContentDefinitionClass>(Base: T): PreloadableDefinitionClass & T {
  return class extends Base implements PreloadableDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { 
        source, url, bytes, mimeType 
      } = object as PreloadableDefinitionObject
      // console.log(this.constructor.name, "source", source, "url", url)

      const sourceOrUrl = source || url || ''
      this.source = source || sourceOrUrl
      this.url = url || sourceOrUrl

      if (bytes) this.bytes = bytes
      if (mimeType) this.mimeType = mimeType
    }

    bytes = 0

    loadType!: LoadType

    mimeType = ''

    source: string

    toJSON(): UnknownObject {
      const json = super.toJSON()
      if (this.url) json.url = this.url
      if (this.source) json.source = this.source
      if (this.bytes) json.bytes = this.bytes
      if (this.mimeType) json.mimeType = this.mimeType
      return json
    }

    url: string
  }
}
