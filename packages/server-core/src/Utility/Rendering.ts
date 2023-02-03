import {
  DefinitionObject, DefinitionObjects, ContentObject, Timing,
  MashObject, TrackObject, ClipObject, assertPopulatedString, 
  DefinitionType, LoadType, ValueObject, OutputType,
  RenderingInput, RenderingCommandOutput, 
} from "@moviemasher/moviemasher.js"


export const renderingInput = (definition: DefinitionObject, clipObject: ValueObject = {}): RenderingInput => {
  const { type, id } = definition
  const definitionObject = {
    ...definition,
    type: type === DefinitionType.VideoSequence ? DefinitionType.Video : type
  }
  const definitions: DefinitionObjects = [definitionObject]
  const clip: ClipObject = renderingClipFromDefinition(definitionObject, clipObject)
  const track: TrackObject = {
    dense: true,// String(type) !== String(DefinitionType.Audio),
    clips: [clip]
  }
  const tracks: TrackObject[] = [track]
  const mashObject = { id }
  const mash: MashObject = { ...mashObject, tracks }
  return { mash, definitions }
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

export const renderingClipFromDefinition = (definition: DefinitionObject, overrides: ValueObject = {}): ClipObject => {
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

export const renderingDefinitionObject = (loadType: LoadType, source: string, definitionId: string, label?: string): DefinitionObject => {
  const type: DefinitionType = definitionTypeFromRaw(loadType) 
  const definition: DefinitionObject = { id: definitionId, type, source, label }
  return definition
}

export const definitionTypeFromRaw = (loadType: LoadType): DefinitionType => {
  switch (loadType) {
    case LoadType.Audio: return DefinitionType.Audio
    case LoadType.Video: return DefinitionType.VideoSequence
    case LoadType.Image: return DefinitionType.Image
    case LoadType.Font: return DefinitionType.Font
  }
}
