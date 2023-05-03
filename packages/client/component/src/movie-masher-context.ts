import type { MediaObjects } from '@moviemasher/lib-core'

import { createContext } from '@lit-labs/context'

import { MediaObjectsParams, MovieMasher } from './declarations.js'



export interface MovieMasherContext {
  mediaObjectsParams: MediaObjectsParams
  mediaObjects: MediaObjects
  accept: string
}

export const movieMasherContext = createContext<MovieMasher>('movie-masher-context')
