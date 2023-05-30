import type { ClientAudioDataOrError, ClientFontDataOrError, ClientImageDataOrError, ClientMediaDataOrError, ClientVideoDataOrError } from './ClientMedia.js'
import type { EndpointRequest } from '../Request/Request.js'




export interface ClientMediaEventDetail {
  request: EndpointRequest
  promise?: Promise<ClientMediaDataOrError>
}

export type ClientMediaEvent = CustomEvent<ClientMediaEventDetail>

export interface ClientAudioEventDetail {
  request: EndpointRequest
  promise?: Promise<ClientAudioDataOrError>
}

export type ClientAudioEvent = CustomEvent<ClientAudioEventDetail>


export interface ClientFontEventDetail {
  request: EndpointRequest
  promise?: Promise<ClientFontDataOrError>
}

export type ClientFontEvent = CustomEvent<ClientFontEventDetail>



export interface ClientImageEventDetail {
  request: EndpointRequest
  promise?: Promise<ClientImageDataOrError>
}

export type ClientImageEvent = CustomEvent<ClientImageEventDetail>



export interface ClientVideoEventDetail {
  request: EndpointRequest
  promise?: Promise<ClientVideoDataOrError>
}

export type ClientVideoEvent = CustomEvent<ClientVideoEventDetail>
