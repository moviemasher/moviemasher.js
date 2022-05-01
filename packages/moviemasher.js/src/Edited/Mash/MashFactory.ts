import { DefinitionObjects, DefinitionBase } from "../../Base/Definition"
import { Mash, MashArgs, MashObject } from "./Mash"
import { MashClass } from "./MashClass"
import { Preloader } from "../../Preloader/Preloader"

export const mashInstance = (object: MashObject = {}, definitionObjects: DefinitionObjects = [], preloader?: Preloader): Mash => {
  const definitions = definitionObjects.map(definition => DefinitionBase.fromObject(definition))
  const mashArgs: MashArgs = { ...object, definitions }
  const instance = new MashClass(mashArgs)
  if (preloader) instance.preloader = preloader
  return instance
}
