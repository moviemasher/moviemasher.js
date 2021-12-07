import { Factory } from "../../Definitions/Factory/Factory"
import { DefinitionType, DefinitionTypes } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { isPopulatedString } from "../../Utilities/Is"
import { DefinitionObject } from "../../Base/Definition"
import { Mash, MashObject } from "./Mash"
import { MashClass } from "./MashInstance"


class MashFactoryImplementation {
  instance(object: MashObject = {}, definitions?: DefinitionObject[]): Mash {
    if (definitions) definitions.forEach(definition => {
      const { id: definitionId, type } = definition
      if (!(type && isPopulatedString(type))) throw Errors.type

      const definitionType = <DefinitionType>type
      if (!DefinitionTypes.includes(definitionType)) throw Errors.type + definitionType

      if (!(definitionId && isPopulatedString(definitionId))) {
        throw Errors.invalid.definition.id + JSON.stringify(definition)
      }
      // installs our definition
      Factory[definitionType].definition(definition)
    })

    return new MashClass(object)
  }
}

const MashFactory = new MashFactoryImplementation()

export { MashFactory }
