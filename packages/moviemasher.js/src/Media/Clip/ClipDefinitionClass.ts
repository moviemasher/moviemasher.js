import { Clip, ClipDefinition, ClipObject } from "./Clip"
import { ClipClass } from "./ClipClass"
import { DataType, DefinitionType, TrackType } from "../../Setup/Enums"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { propertyInstance } from "../../Setup/Property"
import { Default, IdPrefix, IdSuffix } from "../../Setup"
import { ObjectUnknown } from "../../declarations"

export class ClipDefinitionClass extends DefinitionBase implements ClipDefinition {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      name: "containerId", type: DataType.ContainerId,
      defaultValue: `${IdPrefix}container${IdSuffix}`
    }))
    this.properties.push(propertyInstance({
      name: "contentId", type: DataType.ContentId,
      defaultValue: `${IdPrefix}content${IdSuffix}`
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

  instanceFromObject(object: ClipObject = {}): Clip {
    return new ClipClass(this.instanceArgs(object))
  }


  streamable = false


  declare trackType: TrackType

  type = DefinitionType.Clip

  visible = false

}
