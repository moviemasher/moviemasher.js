import { DefinitionClass } from "../../Definition/Definition"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { Size } from "../../Utility/Size"
import { TweenableDefinition, TweenableDefinitionClass } from "./Tweenable"

export function TweenableDefinitionMixin<T extends DefinitionClass>(Base: T): TweenableDefinitionClass & T {
  return class extends Base implements TweenableDefinition {

    constructor(...args: any[]) {
      super(...args)
      this.properties.push(propertyInstance({ 
        name: "muted", type: DataType.Boolean 
      }))
    }
  }
}
