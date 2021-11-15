import { DefinitionBase } from "../Definition/Definition"
import { Masher, MasherObject } from "./Masher"
import { MasherClass } from "./MasherInstance"
import { Any } from "../../declarations"
import { DataType, DefinitionType } from "../../Setup/Enums"
import { Property } from "../../Setup/Property"
import { Definitions } from "../Definitions/Definitions"
import { Default } from "../../Setup/Default"

class MasherDefinitionClass extends DefinitionBase {
  constructor(...args : Any[]) {
    super(...args)
    this.properties.push(new Property({ name: "autoplay", type: DataType.Boolean, value: Default.masher.autoplay }))
    this.properties.push(new Property({ name: "precision", type: DataType.Number, value: Default.masher.precision }))
    this.properties.push(new Property({ name: "loop", type: DataType.Boolean, value: Default.masher.loop }))
    this.properties.push(new Property({ name: "fps", type: DataType.Number, value: Default.masher.fps }))
    this.properties.push(new Property({ name: "volume", type: DataType.Number, value: Default.masher.volume }))
    this.properties.push(new Property({ name: "buffer", type: DataType.Number, value: Default.masher.buffer}))
    Definitions.install(this)
  }

  id = "com.moviemasher.masher.default"

  get instance() : Masher {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : MasherObject) : Masher {
    const instance = new MasherClass({ ...this.instanceObject, ...object })
    return instance
  }

  retain = true

  type = DefinitionType.Masher
}

export { MasherDefinitionClass }
