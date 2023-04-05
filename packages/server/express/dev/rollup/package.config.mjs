import path from 'path'
import { rollupPackage} from "../../../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherServer'
const libName = 'server-express'

export default rollupPackage({ name, libName, src: path.resolve('src') })


