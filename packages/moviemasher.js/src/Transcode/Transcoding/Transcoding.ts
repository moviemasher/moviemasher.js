import { LoadedMedia } from "../../declarations";
import { isDefinitionType, LoadType, DefinitionType } from "../../Setup/Enums";
import { isRequestable, Requestable, RequestableObject } from "../../Base/Requestable";


export interface TranscodingObject extends RequestableObject {
  loadedMedia?: LoadedMedia
  type?: DefinitionType | string
  kind?: string
}

export type TranscodingObjects = TranscodingObject[]

export interface Transcoding extends Required<Requestable> {

  type: DefinitionType
  kind: string
  loadType: LoadType
  loadedMediaPromise: Promise<LoadedMedia>
  loadedMedia?: LoadedMedia
  srcPromise: Promise<string>
}

export type Transcodings = Transcoding[]


export const isTranscoding = (value: any): value is Transcoding => {
  return isRequestable(value) && "type" in value && isDefinitionType(value.type)
}
