import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Factories } from "../../Definitions/Factories"
import { TransitionDefinitionClass } from "./TransitionDefinitionClass"
import {
  Transition, TransitionDefinition, TransitionDefinitionObject, TransitionObject
} from "./Transition"

import transitionCrossfadeJson from "../../Definitions/DefinitionObjects/transition/crossfade.json"

export const transitionDefinition = (object : TransitionDefinitionObject) : TransitionDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  return new TransitionDefinitionClass(object)
}

export const transitionDefaults = [transitionDefinition(transitionCrossfadeJson)]

export const transitionDefinitionFromId = (id: string): TransitionDefinition => {
  const definition = transitionDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return transitionDefinition({ id })
}

export const transitionInstance = (object: TransitionObject): Transition => {
  const { id } = object
  const definition = transitionDefinitionFromId(id!)
  return definition.instanceFromObject(object)
}

export const transitionFromId = (id: string): Transition => {
  const definition = transitionDefinitionFromId(id)
  return definition.instanceFromObject({ id })
}

Factories[DefinitionType.Transition] = {
  definition: transitionDefinition,
  definitionFromId: transitionDefinitionFromId,
  fromId: transitionFromId,
  instance: transitionInstance,
  defaults: transitionDefaults,
}
