import path from 'path'
import { rollupClient} from "../../../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherClientCore'
const libName = 'client-core'
const src = path.resolve('src')

export default rollupClient({ name, libName, src })
