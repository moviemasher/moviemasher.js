import { Factory } from "../../Definitions/Factory/Factory"
import { DefinitionType, DefinitionTypes } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { isPopulatedString } from "../../Utility/Is"
import { DefinitionObject } from "../../Base/Definition"
import { Cast, CastObject } from "./Cast"
import { CastClass } from "./CastClass"

/**
 * @category Factory
 */
const CastFactory = {
  instance: (object: CastObject = {}, definitions?: DefinitionObject[]): Cast => {
    if (definitions) definitions.forEach(definition => {
      const { id: definitionId, type } = definition
      if (!(type && isPopulatedString(type))) throw Errors.type + definitionId

      const definitionType = type as DefinitionType
      if (!DefinitionTypes.includes(definitionType)) throw Errors.type + definitionType

      if (!(definitionId && isPopulatedString(definitionId))) {
        throw Errors.invalid.definition.id + JSON.stringify(definition)
      }
      // installs our definition
      Factory[definitionType].definition(definition)
    })

    return new CastClass(object)
  }
}

export { CastFactory }
