import { Factory } from "../../Definitions/Factory/Factory"
import { DefinitionObjects } from "../../Base/Definition"
import { Mash, MashArgs, MashObject } from "./Mash"
import { MashClass } from "./MashClass"
import { Preloader } from "../../Preloader/Preloader"

/**
 * @category Factory
 */
const MashFactory = {
  instance: (object: MashObject = {}, definitionObjects: DefinitionObjects = [], preloader?: Preloader): Mash => {
    const definitions = definitionObjects.map(definition => Factory.definitionFromObject(definition))
    const mashArgs: MashArgs = {...object, definitions }
    const instance = new MashClass(mashArgs)
    if (preloader) instance.preloader = preloader
    return instance
  }
}

export { MashFactory }
