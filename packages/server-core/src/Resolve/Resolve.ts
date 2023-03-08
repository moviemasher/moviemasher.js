import { Request } from "@moviemasher/moviemasher.js/src/Helpers/Request/Request"
import { 
  ClientFont, DataOrError, PathDataOrError 
} from "@moviemasher/moviemasher.js/src/Helpers/ClientMedia/ClientMedia"
import { FontType } from "@moviemasher/moviemasher.js/src/Setup/Enums"
import { requestExtension, requestClientMediaPromise, requestPromise } from "@moviemasher/moviemasher.js/src/Helpers/Request/RequestFunctions"
import { errorPromise } from "@moviemasher/moviemasher.js/src/Helpers/Error/ErrorFunctions"
import { ErrorName } from "@moviemasher/moviemasher.js/src/Helpers/Error/ErrorName"


export interface Resolver {
  requestPromise: (file: string) => Promise<Request>
  extension: string
}

export type ResolverRecord = Record<string, Resolver>

export const Resolvers: ResolverRecord = {}

export const resolverLoad = (mimeType?: string): Resolver | undefined => {
  if (!mimeType) return

  return Resolvers[mimeType]
}



// export function resolverPromise(file: string, mimeType: string, type: AudioType): Promise<DataOrError<ClientAudio>>
// export function resolverPromise(file: string, mimeType: string, type: VideoType): Promise<DataOrError<ClientVideo>>
// export function resolverPromise(file: string, mimeType: string, type: ImageType): Promise<DataOrError<ClientImage>>
export function resolverPromise(file: string, mimeType: string, type: FontType): Promise<DataOrError<ClientFont>>
// export function resolverPromise(file: string, mimeType: string, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
{
  const resolver = resolverLoad(mimeType)
  if (!resolver) return errorPromise(ErrorName.Type, { value: mimeType })

  const { requestPromise: resolverRequestPromise } = resolver
  const promise = resolverRequestPromise(file)
  return promise.then(request => {
    switch(type) {
      // case AudioType: return requestClientMediaPromise(request, type)
      case FontType: return requestClientMediaPromise(request, type)
      // case ImageType: return requestClientMediaPromise(request, type)
      // case VideoType: return requestClientMediaPromise(request, type)
    }
  })
}

export type ResolverPromise = typeof resolverPromise

export const resolverPathPromise = (file: string, mimeType?: string): PathDataOrError | Promise<PathDataOrError> => {
  const resolver = resolverLoad(mimeType)
  if (resolver) return resolver.requestPromise(file).then(requestPromise)

  return { data: file }
}

export const resolverExtension = (request: Request, mimeType?: string) => {
  const resolver = resolverLoad(mimeType)
  return resolver ? resolver.extension : requestExtension(request) 
}

