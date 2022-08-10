import { DefinitionType } from "../../../../Setup/Enums"
import { Errors } from "../../../../Setup/Errors"
import { assertPopulatedString } from "../../../../Utility/Is"
import { Factories } from "../../../../Definitions/Factories"
import { ClipDefinitionClass } from "./ClipDefinitionClass"
import { Clip, ClipDefinition, ClipDefinitionObject, ClipObject } from "./Clip"

import clipDefaultJson from "../../../../Definitions/DefinitionObjects/clip/default.json"

export const clipDefault = new ClipDefinitionClass(clipDefaultJson)
export const clipDefaultId = clipDefault.id
export const clipDefaults = [clipDefault]

export const clipDefinition = (object : ClipDefinitionObject) : ClipDefinition => {
  const { id } = object
  assertPopulatedString(id)

  return new ClipDefinitionClass({...object, type: DefinitionType.Clip })
}

export const clipDefinitionFromId = (id: string): ClipDefinition => {
  const definition = clipDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return clipDefinition({ id })
}

export const clipInstance = (object: ClipObject = {}): Clip => {
  const { definitionId = clipDefaultId } = object
  if (!definitionId) throw Errors.id

  const definition = clipDefinitionFromId(definitionId)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const clipFromId = (id: string): Clip => {
  const definition = clipDefinitionFromId(id)
  const instance = definition.instanceFromObject({ definitionId: id })
  return instance
}

Factories[DefinitionType.Clip] = {
  definition: clipDefinition,
  definitionFromId: clipDefinitionFromId,
  fromId: clipFromId,
  instance: clipInstance,
  defaults: clipDefaults,
}
