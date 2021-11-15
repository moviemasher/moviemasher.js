import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities/Is"
import { Definitions } from "../Definitions"
import { Factories } from "../Factories"
import { VideoDefinitionClassImplementation } from "../Video/VideoDefinition"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"

const videoDefinition = (object : VideoDefinitionObject) : VideoDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  if (Definitions.installed(id)) return <VideoDefinition> Definitions.fromId(id)

  return new VideoDefinitionClassImplementation(object)
}

const videoDefinitionFromId = (id : string) : VideoDefinition => {
  return videoDefinition({ id })
}

const videoInstance = (object : VideoObject) : Video => {
  const definition = videoDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

const videoFromId = (id : string) : Video => {
  return videoInstance({ id })
}

const videoInitialize = () : void => {}

const videoDefine = (object : VideoDefinitionObject) : VideoDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  return videoDefinition(object)
}


/**
 * @internal
 */
const videoInstall = (object: VideoDefinitionObject): VideoDefinition => {
  const instance = videoDefine(object)
  instance.retain = true
  return instance
}



const VideoFactoryImplementation = {
  define: videoDefine,
  install: videoInstall,
  definition: videoDefinition,
  definitionFromId: videoDefinitionFromId,
  fromId: videoFromId,
  initialize: videoInitialize,
  instance: videoInstance,
}

Factories[DefinitionType.Video] = VideoFactoryImplementation

export {
  videoInstall,
  videoDefine,
  videoDefinition,
  videoDefinitionFromId,
  VideoFactoryImplementation,
  videoFromId,
  videoInitialize,
  videoInstance,
}
