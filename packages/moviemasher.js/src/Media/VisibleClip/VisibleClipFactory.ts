import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { assertPopulatedString } from "../../Utility/Is"
import { Factories } from "../../Definitions/Factories"
import { VisibleClipDefinitionClass } from "./VisibleClipDefinitionClass"
import { VisibleClip, VisibleClipDefinition, VisibleClipDefinitionObject, VisibleClipObject } from "./VisibleClip"

import defaultVisibleClipJson from "../../Definitions/DefinitionObjects/visible/default.json"

export const visibleClipDefault = new VisibleClipDefinitionClass(defaultVisibleClipJson)
export const visibleClipDefaults = [visibleClipDefault]

export const visibleClipDefinition = (object : VisibleClipDefinitionObject) : VisibleClipDefinition => {
  const { id } = object
  assertPopulatedString(id)

  return new VisibleClipDefinitionClass({...object, type: DefinitionType.Visible })
}

export const visibleClipDefinitionFromId = (id: string): VisibleClipDefinition => {
  const definition = visibleClipDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return visibleClipDefinition({ id })
}

export const visibleClipInstance = (object: VisibleClipObject): VisibleClip => {
  const { definitionId } = object
  if (!definitionId) throw Errors.id

  const definition = visibleClipDefinitionFromId(definitionId)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const visibleClipFromId = (id: string): VisibleClip => {
  const definition = visibleClipDefinitionFromId(id)
  const instance = definition.instanceFromObject({ definitionId: id })
  return instance
}

Factories[DefinitionType.Visible] = {
  definition: visibleClipDefinition,
  definitionFromId: visibleClipDefinitionFromId,
  fromId: visibleClipFromId,
  instance: visibleClipInstance,
  defaults: visibleClipDefaults,
}
