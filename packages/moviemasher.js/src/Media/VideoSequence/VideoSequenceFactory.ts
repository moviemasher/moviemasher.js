import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Definitions } from "../../Definitions"
import { Factories } from "../../Definitions/Factories"
import { VideoSequenceDefinitionClass } from "./VideoSequenceDefinition"
import { VideoSequence, VideoSequenceDefinition, VideoSequenceDefinitionObject, VideoSequenceObject } from "./VideoSequence"

const videoSequenceDefinition = (object : VideoSequenceDefinitionObject) : VideoSequenceDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  if (Definitions.installed(id)) return <VideoSequenceDefinition> Definitions.fromId(id)

  return new VideoSequenceDefinitionClass(object)
}

const videoSequenceDefinitionFromId = (id : string) : VideoSequenceDefinition => {
  return videoSequenceDefinition({ id })
}

const videoSequenceInstance = (object : VideoSequenceObject) : VideoSequence => {
  const definition = videoSequenceDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

const videoSequenceFromId = (id : string) : VideoSequence => {
  return videoSequenceInstance({ id })
}

const videoSequenceInitialize = () : void => {}

const videoSequenceInstall = (object : VideoSequenceDefinitionObject) : VideoSequenceDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  Definitions.uninstall(id)
  const instance = videoSequenceDefinition(object)
  instance.retain = true
  Definitions.install(instance)
  return instance

}



const VideoSequenceFactoryImplementation = {
  install: videoSequenceInstall,
  definition: videoSequenceDefinition,
  definitionFromId: videoSequenceDefinitionFromId,
  fromId: videoSequenceFromId,
  initialize: videoSequenceInitialize,
  instance: videoSequenceInstance,
}

Factories[DefinitionType.VideoSequence] = VideoSequenceFactoryImplementation

export {
  videoSequenceInstall,
  videoSequenceDefinition,
  videoSequenceDefinitionFromId,
  VideoSequenceFactoryImplementation,
  videoSequenceFromId,
  videoSequenceInitialize,
  videoSequenceInstance,
}
