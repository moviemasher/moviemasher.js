import {
  MediaObject, MediaObjects, ContentObject, Timing,
  TrackObject, ClipObject, assertPopulatedString, 
  DefinitionType, LoadType, ValueObject, MashAndMediaObject, 
  RenderingCommandOutput, RenderingInput,
} from "@moviemasher/moviemasher.js"


export const renderingInput = (definition: MediaObject, clipObject: ValueObject = {}): RenderingInput => {
  const { type, id } = definition
  const definitionObject = {
    ...definition,
    type: type === DefinitionType.Sequence ? DefinitionType.Video : type
  }
  const definitions: MediaObjects = [definitionObject]
  const clip: ClipObject = renderingClipFromDefinition(definitionObject, clipObject)
  const track: TrackObject = {
    dense: true,// String(type) !== String(DefinitionType.Audio),
    clips: [clip]
  }
  const tracks: TrackObject[] = [track]
  const mashObject = { id }
  const mash: MashAndMediaObject = { ...mashObject, tracks, media: definitions }
  return { mash }
}


export const renderingOutputFile = (index: number, commandOutput: RenderingCommandOutput, extension?: string): string => {
  const { basename, format, extension: outputExtension, outputType } = commandOutput
  const ext = extension || outputExtension || format
  assertPopulatedString(ext)
  const components = [basename || outputType]
  if (index && !basename) components.push(String(index))
  components.push(ext)
  return components.join('.')
}

export const renderingSource = (commandOutput?: RenderingCommandOutput): string => {
  if (!commandOutput) {
    // console.log("renderingSource with no commandOutput")
    return ''
  }

  const { format, extension, outputType } = commandOutput
  const ext = extension || format
  // if (outputType === OutputType.ImageSequence) return ''

  return `${outputType}.${ext}`
}

export const renderingClipFromDefinition = (definition: MediaObject, overrides: ValueObject = {}): ClipObject => {
  const { id, type } = definition
  const { id: _, containerId: suppliedContainerId, ...rest } = overrides
  const contentId = id || type
  const supplied = suppliedContainerId ? String(suppliedContainerId) : undefined
  const containerId = type === 'audio' ? '' : supplied
  const content: ContentObject = {...rest}
  const visibleClipObject: ClipObject = {
    contentId, content, containerId
  }
  if (type === DefinitionType.Image) {
    visibleClipObject.timing = Timing.Custom
    visibleClipObject.frames = 1
  }
  // console.log("renderingClipFromDefinition", overrides, visibleClipObject)
  return visibleClipObject
}

export const renderingMediaObject = (loadType: LoadType, source: string, definitionId: string, label?: string): MediaObject => {
  const type: DefinitionType = definitionTypeFromRaw(loadType) 
  const definition: MediaObject = { id: definitionId, type, source, label }
  return definition
}

export const definitionTypeFromRaw = (loadType: LoadType): DefinitionType => {
  switch (loadType) {
    case LoadType.Audio: return DefinitionType.Audio
    case LoadType.Video: return DefinitionType.Sequence
    case LoadType.Image: return DefinitionType.Image
    case LoadType.Font: return DefinitionType.Font
  }
}
