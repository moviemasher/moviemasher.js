import path from 'path'
import { rollupPackage} from "../../../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherClientCore'
const libName = 'client-core'
const src = path.resolve('src')

export default rollupPackage({ name, libName, src })


