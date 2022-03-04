import { Factory } from "../../Definitions/Factory/Factory"
import { DefinitionType, DefinitionTypes } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { isPopulatedString } from "../../Utility/Is"
import { DefinitionObjects } from "../../Base/Definition"
import { Mash, MashArgs, MashObject } from "./Mash"
import { MashClass } from "./MashClass"
import { Preloader } from "../../Preloader/Preloader"

/**
 * @category Factory
 */
const MashFactory = {
  instance: (object: MashObject = {}, definitionObjects: DefinitionObjects = [], preloader?: Preloader): Mash => {
    const definitions = definitionObjects.map(definition => {
      const { id: definitionId, type } = definition
      if (!(type && isPopulatedString(type))) `${Errors.type} MashFactory.instance ${definitionId}`

      const definitionType = <DefinitionType>type
      if (!DefinitionTypes.includes(definitionType)) throw `${Errors.type} MashFactory.instance ${definitionType}`

      if (!(definitionId && isPopulatedString(definitionId))) {
        throw Errors.invalid.definition.id + JSON.stringify(definition)
      }
      // installs our definition
      return Factory[definitionType].definition(definition)
    })
    const mashArgs: MashArgs = {...object, definitions }
    const instance = new MashClass(mashArgs)
    if (preloader) instance.preloader = preloader
    return instance
  }
}

export { MashFactory }
