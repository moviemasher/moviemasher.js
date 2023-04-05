import type {
  ClientAudio, ClientFont, ClientImage, ClientMedia, ClientMediaType, ClientVideo, DataOrError
} from '../../Helpers/ClientMedia/ClientMedia.js'
import type { AudioType, FontType, ImageType, VideoType } from '../../Setup/Enums.js'
import {isDefiniteError} from '../../Utility/Is.js'
import {TypeResolve} from '../Plugin.js'
import {pluginDataOrError} from '../PluginFunctions.js'

export function resolveMimetypePromise(file: string, mimeType: string, type: AudioType): Promise<DataOrError<ClientAudio>>
export function resolveMimetypePromise(file: string, mimeType: string, type: FontType): Promise<DataOrError<ClientFont>>
export function resolveMimetypePromise(file: string, mimeType: string, type: ImageType): Promise<DataOrError<ClientImage>>
export function resolveMimetypePromise(file: string, mimeType: string, type: VideoType): Promise<DataOrError<ClientVideo>>
export function resolveMimetypePromise(file: string, mimeType: string, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
export function resolveMimetypePromise(file: string, mimeType: string, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
{
  const orError = pluginDataOrError(mimeType, TypeResolve)
  if (!isDefiniteError(orError)) {
    const { data: plugin } = orError
    return plugin.promise(file, type)
  }
  return Promise.resolve(orError)
}
