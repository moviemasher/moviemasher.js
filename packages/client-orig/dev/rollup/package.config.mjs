import path from 'path'
import { rollupPackage} from "../../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherClient'
const libName = 'client-orig'

export default rollupPackage({ name, libName, src: path.resolve('src') })


