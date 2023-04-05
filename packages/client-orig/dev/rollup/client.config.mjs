import path from 'path'
import { rollupClient} from "../../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherClient'
const libName = 'client-orig'

export default rollupClient({ name, libName, src: path.resolve('src') })


