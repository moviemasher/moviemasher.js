import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities"
import { TransitionDefinitionClass } from "./TransitionDefinition"
import { Definitions } from "../Definitions/Definitions"
import transitionCrossfadeJson from "./DefinitionObjects/crossfade.json"
import { Factories } from "../Factories/Factories"
import {
  Transition,
  TransitionDefinition,
  TransitionDefinitionObject,
  TransitionObject,
} from "./Transition"

const transitionDefinition = (object : TransitionDefinitionObject) : TransitionDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  if (Definitions.installed(id)) return <TransitionDefinition> Definitions.fromId(id)

  return new TransitionDefinitionClass(object)
}

const transitionDefinitionFromId = (id : string) : TransitionDefinition => {
  return transitionDefinition({ id })
}

const transitionInstance = (object : TransitionObject) : Transition => {
  const definition = transitionDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

const transitionFromId = (id : string) : Transition => {
  return transitionInstance({ id })
}

const transitionInitialize = () : void => {
  transitionDefinition(transitionCrossfadeJson)
}

const transitionDefine = (object : TransitionDefinitionObject) : TransitionDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  return transitionDefinition(object)
}

const TransitionFactoryImplementation = {
  define: transitionDefine,
  definition: transitionDefinition,
  definitionFromId: transitionDefinitionFromId,
  fromId: transitionFromId,
  initialize: transitionInitialize,
  instance: transitionInstance,
}

Factories.transition = TransitionFactoryImplementation

export {
  transitionDefine,
  transitionDefinition,
  transitionDefinitionFromId,
  TransitionFactoryImplementation,
  transitionFromId,
  transitionInitialize,
  transitionInstance,
}
