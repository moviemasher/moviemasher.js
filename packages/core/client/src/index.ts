export * from './Client/index.js'
export * from './Helpers/index.js'
export * from './Resolve/index.js'
export * from './Protocol/index.js'
export * from './Translate/index.js'
export * from './Types/index.js'
export * from './Utility/Audio.js'


import { idGenerateString } from '@moviemasher/lib-core'

export const hello = () => `Hello, ${idGenerateString()}`
