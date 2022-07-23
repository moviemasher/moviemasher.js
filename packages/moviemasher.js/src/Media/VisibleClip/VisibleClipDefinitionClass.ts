import { VisibleClip, VisibleClipDefinition, VisibleClipObject } from "./VisibleClip"
import { VisibleClipClass } from "./VisibleClipClass"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { DataType, DefinitionType } from "../../Setup/Enums"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { propertyInstance } from "../../Setup/Property"
import { Default, IdPrefix, IdSuffix } from "../../Setup"
import { ObjectUnknown } from "../../declarations"

// const VisibleClipMixin = ClipDefinitionMixin(DefinitionBase)
export class VisibleClipDefinitionClass extends DefinitionBase implements VisibleClipDefinition {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      name: "containerId", type: DataType.ContainerId,
      defaultValue: `${IdPrefix}shapecontainer${IdSuffix}`
    }))
    this.properties.push(propertyInstance({
      name: "contentId", type: DataType.ContentId,
      defaultValue: `${IdPrefix}colorcontent${IdSuffix}`
    }))
    this.properties.push(propertyInstance({ name: "label", defaultValue: "" }))
      this.properties.push(propertyInstance({ type: DataType.Frame }))
      this.properties.push(propertyInstance({ name: "frames", type: DataType.Frame, defaultValue: -1 }))
    
  }


  audible = false

    
  private _duration? : number

  get duration() : number {
    if (!this._duration) {
      const object = Default.definition as ObjectUnknown
      const value = object ? object[this.type] : undefined
      this._duration = value ? Number(value.duration) : 0
    }
    return this._duration
  }

  set duration(value : number) { this._duration = value }

  instanceFromObject(object: VisibleClipObject = {}): VisibleClip {
    return new VisibleClipClass(this.instanceArgs(object))
  }


  streamable = false


  type = DefinitionType.Visible


  visible = false

}
