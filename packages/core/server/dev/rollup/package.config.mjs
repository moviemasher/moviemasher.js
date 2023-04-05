import path from 'path'
import { rollupPackage } from "../../../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherServerCore'
const libName = 'server-core'

export default rollupPackage({ name, libName, src: path.resolve('src') })


