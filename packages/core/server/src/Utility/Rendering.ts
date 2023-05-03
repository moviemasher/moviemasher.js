
import type {
   MediaObject, MediaObjects, ContentObject, TrackObject, ClipObject, 
   ValueRecord, MashAndMediaObject, RenderingCommandOutput, RenderingInput 
} from "@moviemasher/lib-core"


import {
 assertPopulatedString, 
 TypeImage, TimingCustom,
} from "@moviemasher/lib-core"


export const renderingInput = (definition: MediaObject, clipObject: ValueRecord = {}): RenderingInput => {
  const { type, id } = definition
  const definitionObject = {
    ...definition,
    type//: type === SequenceType ? VideoType : type
  }
  const definitions: MediaObjects = [definitionObject]
  const clip: ClipObject = renderingClipFromDefinition(definitionObject, clipObject)
  const track: TrackObject = {
    dense: true,// String(type) !== String(AudioType),
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
  // if (outputType === EncodeType.ImageSequence) return ''

  return `${outputType}.${ext}`
}

export const renderingClipFromDefinition = (definition: MediaObject, overrides: ValueRecord = {}): ClipObject => {
  const { id, type } = definition
  const { id: _, containerId: suppliedContainerId, ...rest } = overrides
  const contentId = id || type
  const supplied = suppliedContainerId ? String(suppliedContainerId) : undefined
  const containerId = type === 'audio' ? '' : supplied
  const content: ContentObject = {...rest}
  const visibleClipObject: ClipObject = {
    contentId, content, containerId
  }
  if (type === TypeImage) {
    visibleClipObject.timing = TimingCustom
    visibleClipObject.frames = 1
  }
  // console.log("renderingClipFromDefinition", overrides, visibleClipObject)
  return visibleClipObject
}

// export const renderingMediaObject = (loadType: LoadType, source: string, id: string, label?: string): MediaObject => {
//   const type: MediaType = definitionTypeFromRaw(loadType) 
//   const definition: MediaObject = { id, type, source, label }
//   return definition
// }

// export const definitionTypeFromRaw = (loadType: LoadType): MediaType => {
//   switch (loadType) {
//     case AudioType: return AudioType
//     case VideoType: return SequenceType
//     case TypeImage: return TypeImage
//     case FontType: return FontType
//   }
//   return errorThrow(ErrorName.Type) 
// }
