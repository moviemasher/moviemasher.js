import path from 'path'
import { rollupPackage } from '../../../../../dev/utils/rollupConfigurations.mjs'

const name = 'MovieMasher'
const libName = 'lib-core'
const src = path.resolve('src')

export default rollupPackage({ name, libName, src })


