import type { MashMedia } from '@moviemasher/lib-core'
import { createContext } from '@lit-labs/context'

export const mashMediaContext = createContext<MashMedia | undefined>('moviemasher-mash-media')

