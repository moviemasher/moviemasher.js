import { Any } from "../../declarations"
import { DataType } from "../../Setup/Enums"
import { Property } from "../../Setup/Property"
import { VisibleDefinitionClass } from "../Visible/Visible"
import { TransformableDefinitionClass } from "./Transformable"

function TransformableDefinitionMixin<T extends VisibleDefinitionClass>(Base: T): TransformableDefinitionClass & T {
  return class extends Base {
    constructor(...args: Any[]) {
      super(...args)
      this.properties.push(new Property({ name: "scaler", type: DataType.Scaler, value: 'com.moviemasher.scaler.default' }))
      this.properties.push(new Property({ name: "merger", type: DataType.Merger, value: 'com.moviemasher.merger.default' }))
      this.properties.push(new Property({ name: "effects", type: DataType.Effects, value: '' }))
    }
  }
}
export { TransformableDefinitionMixin }
