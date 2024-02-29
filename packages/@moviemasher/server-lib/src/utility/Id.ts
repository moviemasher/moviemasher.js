import { COLON, MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
// import crypto from 'crypto'

export const idUnique = () => (
   [(new Date()).toISOString().split(COLON).slice(0, -1).join(''), MOVIE_MASHER.window.crypto.randomUUID()].join('-')
)
