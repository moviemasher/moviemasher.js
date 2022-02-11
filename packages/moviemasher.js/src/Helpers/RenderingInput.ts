import { RenderingInput } from "../Api/Rendering"
import { DefinitionObject } from "../Base/Definition"
import { TrackObject } from "../Media/Track/Track"
import { ClipObject } from "../Mixin/Clip/Clip"
import { DefinitionType, RawType, TrackType } from "../Setup/Enums"

const uuid = require('uuid').v4


const trackTypeFromRaw = (rawType: RawType): TrackType => (
  rawType === RawType.Audio ? TrackType.Audio : TrackType.Video
)

const definitionTypeFromRaw = (rawType: RawType): DefinitionType => {
  switch (rawType) {
    case RawType.Audio: return DefinitionType.Audio
    case RawType.Video: return DefinitionType.VideoSequence
    case RawType.Image: return DefinitionType.Image
  }
}

const renderingInputFromRaw = (rawType: RawType, source: string, id?: string): RenderingInput => {
  const type: DefinitionType = definitionTypeFromRaw(rawType)
  const definition: DefinitionObject = {
    id: id || uuid(), type, source
  }

  const definitions: DefinitionObject[] = [definition]

  const clip: ClipObject = {
    definitionId: definition.id
  }
  const track: TrackObject = {
    trackType: trackTypeFromRaw(rawType),
    clips: [clip]
  }
  const mash = { tracks: [track]}
  return { mash, definitions }

}

export { renderingInputFromRaw }
