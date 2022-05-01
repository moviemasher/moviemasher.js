import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Definitions } from "../../Definitions/Definitions"
import { Factories } from "../../Definitions/Factories"
import { TransitionDefinitionClass } from "./TransitionDefinitionClass"
import {
  Transition, TransitionDefinition, TransitionDefinitionObject, TransitionObject
} from "./Transition"

import transitionCrossfadeJson from "../../Definitions/DefinitionObjects/transition/crossfade.json"

export const transitionDefinition = (object : TransitionDefinitionObject) : TransitionDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  if (Definitions.installed(id)) return <TransitionDefinition> Definitions.fromId(id)

  return new TransitionDefinitionClass(object)
}

export const transitionDefinitionFromId = (id : string) : TransitionDefinition => {
  return transitionDefinition({ id })
}

export const transitionInstance = (object : TransitionObject) : Transition => {
  const definition = transitionDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const transitionFromId = (id : string) : Transition => {
  return transitionInstance({ id })
}

export const transitionInitialize = () : void => {
  transitionInstall(transitionCrossfadeJson)
}

export const transitionInstall = (object : TransitionDefinitionObject) : TransitionDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  Definitions.uninstall(id)
  const instance = transitionDefinition(object)
  Definitions.install(instance)
  return instance
}

export const TransitionFactoryImplementation = {
  install: transitionInstall,
  definition: transitionDefinition,
  definitionFromId: transitionDefinitionFromId,
  fromId: transitionFromId,
  initialize: transitionInitialize,
  instance: transitionInstance,
}

Factories[DefinitionType.Transition] = TransitionFactoryImplementation
