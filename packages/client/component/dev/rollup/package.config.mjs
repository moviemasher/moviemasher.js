import path from 'path'
import { rollupPackage} from "../../../../../dev/utils/rollupConfigurations.mjs"

const framework = 'component'
const libName = `client-${framework}`
const name = `MovieMasherClient`

const src = path.resolve('src')
export default rollupPackage({ name, libName, src })


