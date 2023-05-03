import type {
  ClientAudio, ClientFont, ClientImage, ClientMedia, ResolvePlugin, EndpointRequest, 
  DataOrError, ClientVideo,
  AudioType, FontType, ImageType, 
  ClientMediaType, VideoType,
} from '@moviemasher/lib-core'
import { 
  CssMimetype, 
  endpointFromUrl, ErrorName, errorPromise, 
  requestClientMediaPromise, TypeResolve, Runtime, urlFromCss, TypeFont,  
} from '@moviemasher/lib-core';

export const PluginResolveTextCss: ResolvePlugin = {
  mimeType: CssMimetype,
  promise: promise,

  url(file: string, type: ClientMediaType): string {
    switch (type) {
      case TypeFont: return urlFromCss(file)
    }
    return ''
  },
  type: TypeResolve
}

function promise(file: string, type: AudioType): Promise<DataOrError<ClientAudio>>
function promise(file: string, type: FontType): Promise<DataOrError<ClientFont>>
function promise(file: string, type: ImageType): Promise<DataOrError<ClientImage>>
function promise(file: string, type: VideoType): Promise<DataOrError<ClientVideo>>
function promise(file: string, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
function promise(file: string, type: ClientMediaType): Promise<DataOrError<ClientMedia>> {
  const url = PluginResolveTextCss.url(file, type)
  if (!url) return errorPromise(ErrorName.Url)

  const request: EndpointRequest = { endpoint: endpointFromUrl(url) }
  return requestClientMediaPromise(request, type) 
}

Runtime.plugins[TypeResolve][CssMimetype] ||= PluginResolveTextCss