import type { MediaType } from '@moviemasher/lib-core'
import { createContext } from '@lit-labs/context'

export const mediaTypeContext = createContext<MediaType>('moviemasher-media-type')

