import { CanvasVisibleSource, UnknownObject } from "../../declarations"
import { FilterDefinition } from "../../Filter/Filter"
import { filterDefinitionFromId } from "../../Filter/FilterFactory"
import { TrackType } from "../../Setup/Enums"
import { ClipDefinitionClass } from "../Clip/Clip"
import { VisibleDefinition, VisibleDefinitionClass, VisibleDefinitionObject } from "./Visible"

export function VisibleDefinitionMixin<T extends ClipDefinitionClass>(Base: T) : VisibleDefinitionClass & T {
  return class extends Base implements VisibleDefinition {
    constructor(...args: any[]) {
      super(...args)

      const [object] = args
      const { width, height } = object as VisibleDefinitionObject
      if (width) this.width = width
      if (height) this.height = height
    }

    height = 0

    loadedVisible(): CanvasVisibleSource | undefined { return }

    toJSON(): UnknownObject {
      const object = super.toJSON()
      if (this.width) object.width = this.width
      if (this.height) object.height = this.height
      return object
    }

    trackType = TrackType.Video

    visible = true

    width = 0

  }
}
