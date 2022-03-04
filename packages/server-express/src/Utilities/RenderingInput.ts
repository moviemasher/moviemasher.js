import {
  RenderingInput,
  DefinitionObject, DefinitionObjects,
  MashObject, TrackObject, ClipObject,
  DefinitionType, RawType, TrackType
} from "@moviemasher/moviemasher.js"

const uuid = require('uuid').v4

const trackTypeFromDefinitionType = (definitionType?: DefinitionType | string): TrackType => (
  String(definitionType) === String(DefinitionType.Audio) ? TrackType.Audio : TrackType.Video
)

const definitionTypeFromRaw = (rawType: RawType): DefinitionType => {
  switch (rawType) {
    case RawType.Audio: return DefinitionType.Audio
    case RawType.Video: return DefinitionType.Video
    case RawType.Image: return DefinitionType.Image
  }
}

const definitionFromRaw = (rawType: RawType, source: string, id?: string, label?: string): DefinitionObject => {
  const type: DefinitionType = definitionTypeFromRaw(rawType)
  const definition: DefinitionObject = {
    id: id || uuid(), type, source, label, processing: 1
  }

  // TODO: properly populate based on type
  switch (type) {
    case DefinitionType.Audio: {
      definition.source = source
      definition.url = source
      break
    }
    case DefinitionType.VideoSequence: {
      definition.source = source
      break
    }
    case DefinitionType.Video: {
      definition.source = source
      definition.url = source
      break
    }
    case DefinitionType.Image: {
      definition.url = definition.icon = source
      break
    }
  }
  return definition
}

const renderingInputFromDefinition = (definition: DefinitionObject): RenderingInput => {
  const definitions: DefinitionObjects = [definition]
  const clip: ClipObject = {
    definitionId: definition.id
  }
  const track: TrackObject = {
    trackType: trackTypeFromDefinitionType(definition.type),
    clips: [clip]
  }
  const tracks: TrackObject[] = [track]
  const mash: MashObject = { tracks }
  return { mash, definitions }
}

const renderingInputFromRaw = (rawType: RawType, source: string, id?: string): RenderingInput => {
  const definition = definitionFromRaw(rawType, source, id)
  return renderingInputFromDefinition(definition)
}

export {
  renderingInputFromRaw,
  definitionFromRaw,
  renderingInputFromDefinition,
}
