import { assertPopulatedString } from "../../Utility/Is"
import { VideoSequenceDefinitionClass } from "./VideoSequenceDefinitionClass"
import { VideoSequence, VideoSequenceDefinition, VideoSequenceDefinitionObject, VideoSequenceObject } from "./VideoSequence"
import { DefinitionType } from "../../Setup/Enums"
import { MediaFactories } from "../MediaFactories"

export const videoSequenceDefinition = (object : VideoSequenceDefinitionObject) : VideoSequenceDefinition => {
  const { id } = object
  assertPopulatedString(id)

  return new VideoSequenceDefinitionClass(object)
}

export const videoSequenceDefinitionFromId = (id : string) : VideoSequenceDefinition => {
  return videoSequenceDefinition({ id })
}

export const videoSequenceInstance = (object : VideoSequenceObject) : VideoSequence => {
  const definition = videoSequenceDefinition(object)
  return definition.instanceFromObject(object)
}

export const videoSequenceFromId = (id : string) : VideoSequence => {
  return videoSequenceInstance({ id })
}

MediaFactories[DefinitionType.VideoSequence] = videoSequenceDefinition
