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
      const { source, url } = object as PreloadableDefinitionObject
      const sourceOrUrl = source || url || ''
      this.source = source || sourceOrUrl
      this.url = url || sourceOrUrl
    }

    loadType!: LoadType

    source: string

    toJSON(): UnknownObject {
      const object = super.toJSON()
      if (this.url) object.url = this.url
      if (this.source) object.source = this.source
      return object
    }

    url: string

    urlAbsolute = ""
  }
}
