import { Any, CanvasVisibleSource, UnknownObject, VisibleSource } from "../../declarations"
import { DataType, TrackType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { ClipDefinitionClass } from "../Clip/Clip"
import { VisibleDefinition, VisibleDefinitionClass, VisibleDefinitionObject } from "./Visible"

export function VisibleDefinitionMixin<T extends ClipDefinitionClass>(Base: T) : VisibleDefinitionClass & T {
  return class extends Base implements VisibleDefinition {
    constructor(...args: Any[]) {
      super(...args)

      const [object] = args
      const { width, height } = object as VisibleDefinitionObject
      if (width) this.width = width
      if (height) this.height = height

      this.properties.push(propertyInstance({ type: DataType.Mode }))
      this.properties.push(propertyInstance({ type: DataType.Number, name: "opacity", min: 0.0, max: 1.0, step: 0.01 }))
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
