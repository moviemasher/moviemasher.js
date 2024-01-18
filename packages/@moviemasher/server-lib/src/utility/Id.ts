import { COLON } from '@moviemasher/shared-lib/runtime.js'
import crypto from 'crypto'

export const idUnique = () => (
   [(new Date()).toISOString().split(COLON).slice(0, -1).join(''), crypto.randomUUID()].join('-')
)
