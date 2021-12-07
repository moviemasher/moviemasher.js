import { Any } from "../../declarations"
// import { DataType } from "../../../Setup/Enums"
// import { Property } from "../../../Setup/Property"
import { VisibleDefinitionClass } from "../Visible/Visible"
import { TransformableDefinitionClass } from "./Transformable"

function TransformableDefinitionMixin<T extends VisibleDefinitionClass>(Base: T): TransformableDefinitionClass & T {
  return class extends Base {
    constructor(...args: Any[]) {
      super(...args)
      // this.properties.push(new Property({ name: "scaler", type: DataType.Object, value: {} }))
      // this.properties.push(new Property({ name: "merger", type: DataType.Object, value: {} }))
    }
  }
}
export { TransformableDefinitionMixin }
