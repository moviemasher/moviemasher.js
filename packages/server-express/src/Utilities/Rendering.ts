import {
  DefinitionObject, DefinitionObjects,
  MashObject, TrackObject, ClipObject,
  DefinitionType, LoadType, TrackType, ValueObject, CommandOutputs, OutputType,
  RenderingInput, RenderingCommandOutput, NumberObject, outputDefaultPopulate, VisibleClipObject, visibleClipDefault,
} from "@moviemasher/moviemasher.js"


import { idUnique } from "./Id"

export const renderingInput = (definition: DefinitionObject, clipObject: ValueObject = {}): RenderingInput => {
  const { type, id } = definition
  const definitionObject = {
    ...definition,
    type: type === DefinitionType.VideoSequence ? DefinitionType.Video : type
  }
  const definitions: DefinitionObjects = [definitionObject]
  const clip: ClipObject = renderingClipFromDefinition(definitionObject, clipObject)
  const track: TrackObject = {
    trackType: String(type) === String(DefinitionType.Audio) ? TrackType.Audio : TrackType.Video,
    clips: [clip]
  }
  const tracks: TrackObject[] = [track]
  const mashObject = { id }
  const mash: MashObject = { ...mashObject, tracks }
  return { mash, definitions }
}

export const renderingDefinitionTypeCommandOutputs = (definitionType: DefinitionType) => {
  const outputs: CommandOutputs = []

  // TODO: support waveform generation
  // TODO: support font uploading
  switch (definitionType) {
    case DefinitionType.Audio: {
      outputs.push({ outputType: OutputType.Audio })
      // outputs.push({ outputType: OutputType.Waveform })
      break
    }
    case DefinitionType.Image: {
      outputs.push({ outputType: OutputType.Image })
      break
    }
    case DefinitionType.VideoSequence: {
      outputs.push({ outputType: OutputType.Audio })
      outputs.push({ outputType: OutputType.Image })
      outputs.push({ outputType: OutputType.ImageSequence })
      // outputs.push({ outputType: OutputType.Waveform })
      break
    }
    case DefinitionType.Font: {
      // outputs.push({ outputType: OutputType.Font })
      break
    }
  }
  return outputs
}

export const renderingCommandOutputs = (commandOutputs: CommandOutputs): CommandOutputs => {
  const counts: NumberObject = {}
  return commandOutputs.map(output => {
    const { outputType } = output
    const populated = outputDefaultPopulate(output)
    if (!counts[outputType]) {
      counts[outputType] = 1
    } else {
      populated.basename ||= `${outputType}-${counts[outputType]}`
      counts[outputType]++
    }
    return populated
  })
}

export const renderingOutputFile = (commandOutput: RenderingCommandOutput, extension?: string): string => {
  const { basename, format, extension: outputExtension, outputType } = commandOutput
  const ext = extension || outputExtension || format
  return `${basename || outputType}.${ext}`
}

export const renderingSource = (commandOutput?: RenderingCommandOutput): string => {
  if (!commandOutput) {
    // console.log("renderingSource with no commandOutput")
    return ''
  }

  const { format, extension, outputType } = commandOutput
  const ext = extension || format
  if (outputType === OutputType.ImageSequence) return ''

  return `${outputType}.${ext}`
}



export const renderingInputFromRaw = (loadType: LoadType, source: string, clip: ValueObject = {}): RenderingInput => {
  const definitionId = clip.id || source 
  const definition = renderingDefinitionObject(loadType, source, String(definitionId), String(clip.label))
  return renderingInput(definition, clip)
}


export const renderingClipFromDefinition = (definition: DefinitionObject, overrides: ValueObject = {}): ClipObject => {
  const { id, type } = definition
  const { id: _, containerId: suppliedContainerId, ...rest } = overrides
  const contentId = id || type
  const supplied = suppliedContainerId ? String(suppliedContainerId) : undefined
  const containerId = type === 'audio' ? '' : supplied
  const definitionId = visibleClipDefault.id
  const visibleClipObject: VisibleClipObject = {
    definitionId, contentId, content: rest, containerId
  }
  // console.log("renderingClipFromDefinition", overrides, visibleClipObject)
  return visibleClipObject
}

export const renderingDefinitionObject = (loadType: LoadType, source: string, definitionId?: string, label?: string): DefinitionObject => {
  const type: DefinitionType = definitionTypeFromRaw(loadType)
  // console.log("renderingDefinitionObject", definitionId, typeof definitionId)
 
  const id = definitionId || idUnique()
  const definition: DefinitionObject = { id, type, source, label }
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
