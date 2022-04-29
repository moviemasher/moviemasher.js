import { Any } from "../../declarations"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { VisibleDefinitionClass } from "../Visible/Visible"
import { TransformableDefinition, TransformableDefinitionClass } from "./Transformable"

function TransformableDefinitionMixin<T extends VisibleDefinitionClass>(Base: T): TransformableDefinitionClass & T {
  return class extends Base implements TransformableDefinition {
    constructor(...args: Any[]) {
      super(...args)
      this.properties.push(propertyInstance({ type: DataType.Scaler }))
      this.properties.push(propertyInstance({ type: DataType.Merger }))
    }
  }
}
export { TransformableDefinitionMixin }
