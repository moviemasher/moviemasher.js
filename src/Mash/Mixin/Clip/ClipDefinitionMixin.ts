
import { Property } from "../../../Setup/Property"
import { Any, Constrained, ObjectUnknown } from "../../../declarations"
import { DataType } from "../../../Setup/Enums"
import { Definition } from "../../Definition/Definition"
import { Default } from "../../../Setup/Default"

const ClipPropertyObjects = [
  { name: "frame", type: DataType.Integer, value: 0 },
  { name: "frames", type: DataType.Integer, value: -1 },
  { name: "track", type: DataType.Integer, value: -1 },
]

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ClipDefinitionMixin<TBase extends Constrained<Definition>>(Base: TBase) {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const properties = ClipPropertyObjects.map(object => new Property(object))
      this.properties.push(...properties)
    }

    audible = false

    // used by theme, image, frame, transition
    private _duration? : number

    get duration() : number {
      if (!this._duration) {
        const object = <ObjectUnknown> Default.definition
        this._duration = Number(object[this.type].duration)
      }
      return this._duration
    }

    set duration(value : number) { this._duration = value }

    visible = false
  }
}

export { ClipDefinitionMixin }
