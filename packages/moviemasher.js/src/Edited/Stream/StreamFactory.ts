import { Factory } from "../../Definitions/Factory/Factory"
import { DefinitionType, DefinitionTypes } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { isPopulatedString } from "../../Utilities/Is"
import { DefinitionObject } from "../../Base/Definition"
import { Stream, StreamObject } from "./Stream"
import { StreamClass } from "./StreamClass"

/**
 * @category Factory
 */
const StreamFactory = {
  instance: (object: StreamObject = {}, definitions?: DefinitionObject[]): Stream => {
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

    return new StreamClass(object)
  }
}

export { StreamFactory }
