
import { Cast, CastObject } from "./Cast"
import { CastClass } from "./CastClass"
import { EditorDefinitions } from "../../Editor/EditorDefinitions"

export const castInstance = (object: CastObject = {}, definitions?: EditorDefinitions): Cast => {
  // if (definitions) definitions.forEach(definition => {
  //   const { id: definitionId, type } = definition
  //   if (!(type && isPopulatedString(type))) throw Errors.type + definitionId

  //   const definitionType = type as DefinitionType
  //   if (!DefinitionTypes.includes(definitionType)) throw Errors.type + definitionType

  //   if (!(definitionId && isPopulatedString(definitionId))) {
  //     throw Errors.invalid.definition.id + JSON.stringify(definition)
  //   }
  //   Factory[definitionType].definition(definition)
  // })

  return new CastClass(object)
}
