
import { createContext } from '@lit-labs/context'

import { MovieMasherContext } from './declarations.js'

export const movieMasherContext = createContext<MovieMasherContext>(Symbol('movie-masher-context'))
