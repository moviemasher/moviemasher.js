import { LoadedMedia } from "../../declarations";
import { DefinitionType, isDefinitionType, LoadType, MediaDefinitionType } from "../../Setup/Enums";
import { isRequestable, Requestable, RequestableObject } from "../Requestable";


export interface TranscodingObject extends RequestableObject {
  loadedMedia?: LoadedMedia
  type?: MediaDefinitionType | string
  kind?: string
}

export type TranscodingObjects = TranscodingObject[]

export interface Transcoding extends Requestable {
  type: MediaDefinitionType
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
