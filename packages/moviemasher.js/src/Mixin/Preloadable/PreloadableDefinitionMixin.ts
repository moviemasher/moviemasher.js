import {
  PreloadableDefinition, PreloadableDefinitionClass, PreloadableDefinitionObject
} from "./Preloadable"
import { ContentDefinitionClass } from "../../Media/Content/Content"
const PreloadableArgs = () => {

}


export function PreloadableDefinitionMixin<T extends ContentDefinitionClass>(Base: T): PreloadableDefinitionClass & T {
  return class extends Base implements PreloadableDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { 
        source, url, bytes, mimeType 
      } = object as PreloadableDefinitionObject
      // console.log(this.constructor.name, "source", source, "url", url)
      if (!this.request)
      if (source) {

      }
      const sourceOrUrl = source || url || ''
      
      // this.source = source || sourceOrUrl
      // this.url = url || sourceOrUrl

      // if (bytes) this.bytes = bytes
      // if (mimeType) this.mimeType = mimeType
    }

    // bytes = 0



  }
}
