import { ClientAudio, ClientFont, ClientImage, ClientMedia, ClientMediaType, ClientMediaTypes, ClientVideo } from "./ClientMedia"
import { GraphFileType, isGraphFileType } from "../../Setup/Enums"
import { isLoadType, LoadType } from "../../Setup/LoadType"
import { errorThrow } from "../Error/ErrorFunctions"
import { isJsonRecord, isObject } from "../../Utility/Is"


export const isClientVideo = (value: any): value is ClientVideo => {
  return isObject(value) && value instanceof HTMLVideoElement
}
export function assertClientVideo(value: any, name?: string): asserts value is ClientVideo {
  if (!isClientVideo(value)) errorThrow(value, "ClientVideo", name)
}

export const isClientImage = (value: any): value is ClientImage => {
  return isObject(value) && value instanceof HTMLImageElement
}
export function assertClientImage(value: any, name?: string): asserts value is ClientImage {
  if (!isClientImage(value)) errorThrow(value, "ClientImage", name)
}

export const isClientAudio = (value: any): value is ClientAudio => {
  return isObject(value) && value instanceof AudioBuffer
}
export function assertClientAudio(value: any, name?: string): asserts value is ClientAudio {
  if (!isClientAudio(value)) errorThrow(value, "ClientAudio", name)
}

export const isClientFont = (value: any): value is ClientFont => {
  return isObject(value) && "family" in value
}
export function assertClientFont(value: any, name?: string): asserts value is ClientFont {
  if (!isClientFont(value)) errorThrow(value, "ClientFont", name)
}


export type LoaderType = GraphFileType | LoadType
export const isLoaderType = (value: any): value is LoaderType => { 
  return isLoadType(value) || isGraphFileType(value)
}
export function assertLoaderType(value: any, name?: string): asserts value is LoaderType {
  if (!isLoaderType(value)) errorThrow(value, "LoaderType", name)
}


export const isClientMedia = (value: any): value is ClientMedia => (
  isClientAudio(value) || 
  isClientFont(value) || 
  isClientImage(value) || 
  isClientVideo(value) || 
  isJsonRecord(value)
)
export function assertClientMedia(value: any, name?: string): asserts value is ClientMedia {
  if (!isClientMedia(value)) errorThrow(value, 'ClientMedia', name)
}

export const isClientMediaType = (type?: any): type is ClientMediaType => {
  return ClientMediaTypes.includes(type)
}
export function assertClientMediaType(value: any, name?: string): asserts value is ClientMediaType {
  if (!isClientMediaType(value)) errorThrow(value, 'ClientMediaType', name)
}
