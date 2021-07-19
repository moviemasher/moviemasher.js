import { DefinitionClass } from "../Definition/Definition"
import { Mash, MashObject } from "./Mash"
import { MashClass } from "./MashInstance"
import { Any } from "../../declarations"
import { DataType, DefinitionType } from "../../Setup/Enums"
import { Property } from "../../Setup/Property"
import { Definitions } from "../Definitions/Definitions"

class MashDefinitionClass extends DefinitionClass {
  constructor(...args : Any[]) {
    super(...args)
    this.properties.push(new Property({ name: "backcolor", type: DataType.Rgba, value: "#00000000" }))
    Definitions.install(this)
  }

  id = "com.moviemasher.mash.default"

  get instance() : Mash {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : MashObject) : Mash {
    const instance = new MashClass({ ...this.instanceObject, ...object })
    return instance
  }

  retain = true
  type = DefinitionType.Mash
}

export { MashDefinitionClass }
