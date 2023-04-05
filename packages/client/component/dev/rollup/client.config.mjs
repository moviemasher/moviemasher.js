import path from 'path'
import { rollupClient} from "../../../../../dev/utils/rollupConfigurations.mjs"

const framework = 'component'
const libName = `client-${framework}`
const name = `MovieMasherClient`
const src = path.resolve('src')
export default rollupClient({ name, libName, src, preserveModules: true })


