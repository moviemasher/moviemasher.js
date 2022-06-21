import { ObjectUnknown } from "../../declarations"
import { propertyInstance } from "../../Setup/Property"
import { DataType, TrackType } from "../../Setup/Enums"
import { Default } from "../../Setup/Default"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"
import { DefinitionClass } from "../../Definition/Definition"
import { ClipDefinition, ClipDefinitionClass } from "./Clip"


export function ClipDefinitionMixin<T extends DefinitionClass>(Base: T) : ClipDefinitionClass & T {
  return class extends Base implements ClipDefinition {
    constructor(...args : any[]) {
      super(...args)
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


    streamable = false

    declare trackType: TrackType

    visible = false
  }
}
