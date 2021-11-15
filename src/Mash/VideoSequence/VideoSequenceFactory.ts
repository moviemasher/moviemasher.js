import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities/Is"
import { Definitions } from "../Definitions"
import { Factories } from "../Factories"
import { VideoSequenceDefinitionClass } from "../VideoSequence/VideoSequenceDefinition"
import { VideoSequence, VideoSequenceDefinition, VideoSequenceDefinitionObject, VideoSequenceObject } from "./VideoSequence"

const videoSequenceDefinition = (object : VideoSequenceDefinitionObject) : VideoSequenceDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

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

const videoSequenceDefine = (object : VideoSequenceDefinitionObject) : VideoSequenceDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  return videoSequenceDefinition(object)
}


/**
 * @internal
 */
const videoSequenceInstall = (object: VideoSequenceDefinitionObject): VideoSequenceDefinition => {
  const instance = videoSequenceDefine(object)
  instance.retain = true
  return instance
}

const VideoSequenceFactoryImplementation = {
  define: videoSequenceDefine,
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
  videoSequenceDefine,
  videoSequenceDefinition,
  videoSequenceDefinitionFromId,
  VideoSequenceFactoryImplementation,
  videoSequenceFromId,
  videoSequenceInitialize,
  videoSequenceInstance,
}
