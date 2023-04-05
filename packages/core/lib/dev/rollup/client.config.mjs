import path from 'path'
import { rollupClient } from '../../../../../dev/utils/rollupConfigurations.mjs'

const name = 'MovieMasher'
const libName = 'lib-core'
const src = path.resolve('src')

export default rollupClient({ name, libName, src })


