import { DefinitionClass } from "../../Definition/Definition"
import { SvgContent, UnknownObject } from "../../declarations"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"
import { LoadType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
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

    graphFiles(_: GraphFileArgs): GraphFiles { return [] }

    loadType!: LoadType

    preloadableSource(editing = false): string {
      return editing ? this.url : this.source
    }

    source: string

    preloadableSvg(trackPreview: TrackPreview): SvgContent {
      throw new Error(Errors.unimplemented)
    }

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
