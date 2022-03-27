
import {
  DefinitionObject, DefinitionObjects,
  MashObject, TrackObject, ClipObject,
  DefinitionType, LoadType, TrackType, ValueObject, CommandOutputs, OutputType,
  RenderingInput, RenderingOutput, RenderingCommandOutput, NumberObject, outputDefaultPopulate,
} from "@moviemasher/moviemasher.js"
import { renderingProcessTestArgs } from "../../../../dev/test/Utilities/renderingProcessArgs"
import { RenderingProcessArgs } from "../Server/RenderingServer/RenderingProcess/RenderingProcess"

const uuid = require('uuid').v4


const renderingInput = (definition: DefinitionObject, clipObject: ValueObject = {}): RenderingInput => {
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

const renderingDefinitionTypeCommandOutputs = (definitionType: DefinitionType) => {
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

const renderingCommandOutputs = (commandOutputs: CommandOutputs): CommandOutputs => {
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

const renderingOutputFile = (commandOutput: RenderingCommandOutput, extension?: string): string => {
  const { basename, format, extension: outputExtension, outputType } = commandOutput
  const ext = extension || outputExtension || format
  return `${basename || outputType}.${ext}`
}

const renderingSource = (commandOutput?: RenderingCommandOutput): string => {
  if (!commandOutput) {
    // console.log("renderingSource with no commandOutput")
    return ''
  }

  const { format, extension, outputType } = commandOutput
  const ext = extension || format
  if (outputType === OutputType.ImageSequence) return ''

  return `${outputType}.${ext}`
}

export const renderingProcessArgs = (id?: string): RenderingProcessArgs => {
  return {
    ...renderingProcessTestArgs(id),
    definitions: [], mash: {}, outputs: []
  }
}

export const renderingInputFromRaw = (loadType: LoadType, source: string, clip: ValueObject = {}): RenderingInput => {
  const definition = renderingDefinitionObject(loadType, source, String(clip.id), String(clip.label))
  return renderingInput(definition, clip)
}


export const renderingClipFromDefinition = (definition: DefinitionObject, overrides: ValueObject = {}): ClipObject => {
  const { id, type } = definition
  const clip: ClipObject = { definitionId: id || type, ...overrides }
  return clip
}

export const renderingDefinitionObject = (loadType: LoadType, source: string, definitionId?: string, label?: string): DefinitionObject => {
  const type: DefinitionType = definitionTypeFromRaw(loadType)
  const id = definitionId || uuid()
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


export {
  renderingOutputFile,
  renderingSource,
  renderingDefinitionTypeCommandOutputs,
  renderingCommandOutputs,
  renderingInput,
}
