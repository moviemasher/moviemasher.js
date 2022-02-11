import { Factory } from "../../Definitions/Factory/Factory"
import { DefinitionType, DefinitionTypes } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { isPopulatedString } from "../../Utility/Is"
import { DefinitionObject } from "../../Base/Definition"
import { Mash, MashObject } from "./Mash"
import { MashClass } from "./MashClass"

/**
 * @category Factory
 */
const MashFactory = {
  instance: (object: MashObject = {}, definitions?: DefinitionObject[]): Mash => {
    if (definitions) definitions.forEach(definition => {
      const { id: definitionId, type } = definition
      if (!(type && isPopulatedString(type))) `${Errors.type} MashFactory.instance ${definitionId}`

      const definitionType = <DefinitionType>type
      if (!DefinitionTypes.includes(definitionType)) throw `${Errors.type} MashFactory.instance ${definitionType}`

      if (!(definitionId && isPopulatedString(definitionId))) {
        throw Errors.invalid.definition.id + JSON.stringify(definition)
      }
      // installs our definition
      Factory[definitionType].definition(definition)
    })

    return new MashClass(object)
  }


}

export { MashFactory }
