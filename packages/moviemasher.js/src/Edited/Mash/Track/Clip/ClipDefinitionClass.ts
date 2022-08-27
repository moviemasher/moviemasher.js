import { Clip, ClipDefinition, ClipObject } from "./Clip"
import { ClipClass } from "./ClipClass"
import { DataType, DefinitionType, Duration, Sizing, Timing } from "../../../../Setup/Enums"
import { DefinitionBase } from "../../../../Definition/DefinitionBase"
import { DataGroup, propertyInstance } from "../../../../Setup/Property"
import { IdPrefix, IdSuffix } from "../../../../Setup/Constants"

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
    this.properties.push(propertyInstance({ name: "label", type: DataType.String }))
    this.properties.push(propertyInstance({ 
      type: DataType.Frame, group: DataGroup.Timing, 
      defaultValue: Duration.None, min: 0, step: 1
    }))
    this.properties.push(propertyInstance({ 
      name: "frames", type: DataType.Frame, defaultValue: Duration.Unknown,
      min: 1, step: 1,
      group: DataGroup.Timing,
    }))
    this.properties.push(propertyInstance({ 
      name: "timing", type: DataType.Timing, defaultValue: Timing.Content,
      group: DataGroup.Timing,
    }))
    this.properties.push(propertyInstance({ 
      name: "sizing", type: DataType.Sizing, defaultValue: Sizing.Content,
      group: DataGroup.Sizing,
    }))
  }

  audible = false
    
  // private _duration? : number
  // get duration() : number {
  //   if (!this._duration) {
  //     const object = Default.definition as ObjectUnknown
  //     const value = object ? object[this.type] : undefined
  //     this._duration = value ? Number(value.duration) : 0
  //   }
  //   return this._duration
  // }
  // set duration(value : number) { this._duration = value }

  instanceFromObject(object: ClipObject = {}): Clip {
    return new ClipClass(this.instanceArgs(object))
  }

  streamable = false

  type = DefinitionType.Clip

  visible = false
}
